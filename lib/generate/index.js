var chalk = require('chalk')

var program = require('commander')
program
  .usage('[options] <blueprint> [entity]')
  .description(chalk.gray('### 😃  Generates code based off a blueprint'))
  .option('-l, --list', 'list all blueprints')
  .parse(process.argv)
var args = program.args

if (args.length < 1) program.help()
