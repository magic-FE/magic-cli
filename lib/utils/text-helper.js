var logSymbols = require('log-symbols')
exports.success = (text) => {
  return `${logSymbols.success} ${text}`
}

exports.error = (text) => {
  return `${logSymbols.error} ${text}`
}

exports.warning = (text) => {
  return `${logSymbols.warning} ${text}`
}

exports.info = (text) => {
  return `${logSymbols.info} ${text}`
}
