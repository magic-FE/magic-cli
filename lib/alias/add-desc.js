var jsonOperator = require('jsonfile')
var chalk = require('chalk')

var aliasTool = require('./alias-tools')
var userAliases = aliasTool.getUserAlias()
var textHelper = require('../utils/text-helper')
var userSourcePath = require('../utils/source-path').userSourcePath

module.exports = function(aliasName, desc) {
  var aliasObj = userAliases[aliasName]
  if (aliasObj) {
    aliasObj.description = desc
    userAliases[aliasName] = aliasObj
    jsonOperator.writeFileSync(userSourcePath, { alias: userAliases })
    console.log(textHelper.success(`Alias ${chalk.green(aliasName)} modify desc success`))
  } else {
    console.log(textHelper.warning(`Alias ${chalk.green(aliasName)} is not exsit`))
  }
}
