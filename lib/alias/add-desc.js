var jsonOperator = require('jsonfile')
var chalk = require('chalk')

var aliasHelper = require('./alias-helper')
var userAliases = aliasHelper.getUserAlias()
var textHelper = require('../utils/text-helper')
var userSourcePath = require('../utils/path-helper').userSourcePath

module.exports = function(aliasName, desc) {
  var changeAlias = userAliases[aliasName]
  if (changeAlias) {
    changeAlias.description = desc
    userAliases[aliasName] = changeAlias
    jsonOperator.writeFileSync(userSourcePath, { alias: userAliases })
    textHelper.success(`Alias ${chalk.green(aliasName)} modify desc success`)
  } else {
    textHelper.warning(`Alias ${chalk.green(aliasName)} is not exsit`)
  }
}
