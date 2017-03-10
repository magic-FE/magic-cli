var chalk = require('chalk')
var Metalsmith = require('metalsmith')
var program = require('commander')
var path = require('path')
var blueprintHelper = require('./blueprints-helper')
var findBlueprints = blueprintHelper.findBluePath
var renderFileName = require('./middlewares/render-filename')
var renderFileContent = require('./middlewares/render-content')
var textHelper = require('../utils/text-helper')
program
  .usage('[options] <blueprint> [entity]')
  .description(chalk.gray('### 😃  Generates code based off a blueprint'))
  .option('-l, --list', 'list all blueprints')
  .option('-c, --cwd [path]', 'Assign  generate start path')
  .option('-f, --force ', 'overwrite the exsits file instead of ask')
  .on('--help', blueprintHelper.printList)
  .parse(process.argv)
var args = program.args
if (program.list) {
  blueprintHelper.printList()
  process.exit()
}
if (args.length < 1) program.help()
if (args.length !== 2) {
  textHelper.error('Error args!! please see --help')
  program.help()
}

var name = args[1]
var blueprintName = args[0]

var bluePath = findBlueprints(blueprintName)
var metalsmith = new Metalsmith(path.join(bluePath, 'files'))
var dest = path.resolve(program.cwd || '.')
textHelper.success(`${chalk.blue('info')}: start generate ${chalk.green(name)} based off blueprint ${chalk.green(blueprintName)}`)
metalsmith
  .use(renderFileName({ name: name, path: blueprintName }, program.force))
  .use(renderFileContent({ name: name, path: blueprintName }))
  .clean(false)
  .source('.')
  .destination(dest)
  .build(function(err, files) {
    if (err) return textHelper.error(`Generate error: ${err.message}`)
    Object.keys(files).forEach(function(file) {
      textHelper.success(`${chalk.cyan('created')} : ${file}`)
    })
    textHelper.success(`Generate ${chalk.green(name)} success, cwd path : ${chalk.green(dest)}`)
  })
