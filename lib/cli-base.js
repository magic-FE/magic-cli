var program = require('commander')
var textHelper = require('../utils/text-helper')
module.exports = function(preConfig, argsLength) {
  preConfig(program)
  if (program.args.length < 1) program.help()
  if (argsLength && program.args.length !== argsLength) {
    console.log(textHelper.error('error args!! please see --help'))
    process.exit()
  }
  return function(cli) {
    cli(program)
  }
}
