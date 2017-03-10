var logSymbols = require('log-symbols')
exports.getSuccess = (text) => {
  return `${logSymbols.success} ${text}`
}

exports.getError = (text) => {
  return `${logSymbols.error} ${text}`
}

exports.getWarning = (text) => {
  return `${logSymbols.warning} ${text}`
}

exports.getInfo = (text) => {
  return `${logSymbols.info} ${text}`
}

exports.success = (text) => {
  console.log(exports.getSuccess(text))
}
exports.error = (text) => {
  console.log(exports.getError(text))
}
exports.warning = (text) => {
  console.log(exports.getWarning(text))
}
exports.info = (text) => {
  console.log(exports.getInfo(text))
}
