var jsonOperator = require('jsonfile')
var sources = require('./source-path')
var officialSourcePath = sources.officialSourcePath
var userSourcePath = sources.userSourcePath
var textHelper = require('./text-helper')
var chalk = require('chalk')
var exists = require('fs').existsSync

exports.deleteUserAlias = function(key, currentAlias, cb) {
  if (typeof currentAlias === 'function') {
    cb = currentAlias
    currentAlias = null
  }
  if (!currentAlias) {
    currentAlias = exports.getUserAlias()
  }
  var projectName = currentAlias[key]
  if (!projectName) {
    return console.log(textHelper.warning(`Alias "${chalk.error(key)}" is not exits,you don't need to delete`))
  }
  delete currentAlias[key]
  jsonOperator.writeFileSync(userSourcePath, { alias: currentAlias })
  console.log(textHelper.success(`Success!! alias "${chalk.green(key)}=>${chalk.green(projectName)}" is already deleted`))
}

exports.getUserAlias = function() {
  return jsonOperator.readFileSync(userSourcePath).alias
}

exports.getOfficialAlias = function() {
  return jsonOperator.readFileSync(officialSourcePath).alias
}

exports.addUserAlias = function(key, value, cb) {
  if (/^[\.]{1,2}\/|^\w:|^\//.test(value) && !exists(value)) { // eslint-disable-line
    return console.log(textHelper.error(`${value} path is not exists, can not set alias`))
  }
  var currentAlias = exports.getUserAlias()
  currentAlias[key] = value
  jsonOperator.writeFile(userSourcePath, { alias: currentAlias })
    // if (err) return console.log(textHelper.error(`Write alias error ${err.message}`))
  console.log(textHelper.success(`Success!! now! you can use ${chalk.green('magic new ' + key)} to init the template ${chalk.green(value)}`))
}
