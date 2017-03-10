var program = require('commander')
var chalk = require('chalk')
var pathHelper = require('../utils/path-helper')
var aliasHelper = require('../alias/alias-helper')

var textHelper = require('../utils/text-helper')

program
  .usage('<alias-name>')
  .description(chalk.gray('### 😭  Remove an alias'))
  .parse(process.argv)

if (program.args.length < 1) program.help()
if (program.args.length !== 1) {
  textHelper.error('Error args!! please see ')
  program.help()
}
pathHelper.checkUserSourcePath()
aliasHelper.deleteUserAlias(program.args[0])
