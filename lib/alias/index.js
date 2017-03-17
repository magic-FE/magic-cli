var program = require('commander')
var chalk = require('chalk')

require('../utils/path-helper').checkUserSourcePath()
var addDesc = require('./add-desc')
var aliasHelper = require('./alias-helper')
var checkAndAdd = require('./add')

program
  .usage('[options] <alias> <repo>/<dir>')
  .description(chalk.gray('### 😃  Config an alias of one template'))
  .option('-l, --list', 'List all alias')
  .option('-r, --relative', 'If local add relative path')
  .option('-d, --desc [desc]', 'Add some description for alias')
  .on('--help', aliasHelper.printList)
  .parse(process.argv)

var args = program.args

if (program.list) {
  aliasHelper.printList()
  process.exit()
}

if (args.length < 1) program.help()

if (args.length === 1) {
  if (program.desc) {
    addDesc(args[0], program.desc)
  } else {
    program.help()
  }
  process.exit()
}
checkAndAdd(program)
