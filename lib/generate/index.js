var chalk = require('chalk')
var Metalsmith = require('metalsmith')
var program = require('commander')
var path = require('path')
var findBlueprints = require('./find-blueprints')
var rendFile = require('./middlewares/render-file')
var textHelper = require('../utils/text-helper')

program
  .usage('[options] <blueprint> [entity]')
  .description(chalk.gray('### 😃  Generates code based off a blueprint'))
  .option('-l, --list', 'list all blueprints')
  .option('-c, --cwd [value]', 'Assign  generate start path')
  .parse(process.argv)
var args = program.args

var name = args[1]
var blueprintName = args[0]

var bluePath = findBlueprints(blueprintName)
var metalsmith = new Metalsmith(path.join(bluePath, 'files'))
var dest = path.resolve(program.cwd || '.')
metalsmith
  .use(rendFile({ name: name, path: blueprintName }))
  .clean(false)
  .source('.')
  .destination(dest)
  .build(function(err) {
    if (err) return console.log(textHelper.error(`Generate error: ${err.message}`))
    console.log(textHelper.success(`Generate ${chalk.green(name)} success , path to ${chalk.green(dest)}`))
  })
