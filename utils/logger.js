var chalk = require('chalk')

var prefix = '   magic-cli :'

exports.success = (text) => {
  console.log(prefix, chalk.green(text))
}

exports.danger = (text) => {
  console.log(prefix, chalk.red(text))
}

exports.warning = (text) => {
  console.log(prefix, chalk.yellow(text))
}
