var program = require('commander')
var chalk = require('chalk')

program
  .usage('<alias-name>')
  .description(chalk.gray('### 😭  Remove an alias'))
  .parse(process.argv)
if (program.args.length < 1) program.help()
