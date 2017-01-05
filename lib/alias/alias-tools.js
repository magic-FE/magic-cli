var jsonOperator = require('jsonfile')
var sources = require('../utils/source-path')
var officialSourcePath = sources.officialSourcePath
var userSourcePath = sources.userSourcePath
var textHelper = require('../utils/text-helper')
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
  var aliasObj = currentAlias[key]
  if (!aliasObj) {
    return console.log(textHelper.warning(`Alias "${chalk.yellow(key)}" is not exits,you don't need to delete`))
  }
  var projectName = aliasObj.value
  delete currentAlias[key]
  jsonOperator.writeFileSync(userSourcePath, { alias: currentAlias })
  console.log(textHelper.success(`Alias "${chalk.red(key)}=>${chalk.red(projectName)}" is already deleted`))
}

exports.getUserAlias = function() {
  return jsonOperator.readFileSync(userSourcePath).alias
}

exports.getOfficialAlias = function() {
  return jsonOperator.readFileSync(officialSourcePath).alias
}

exports.addUserAlias = function(key, aliasObj, cb) {
  var value = aliasObj.value
  if (sources.localPathRegx.test(value) && !exists(value)) {
    return console.log(textHelper.error(`${value} path is not exists, can not set alias`))
  }
  var currentAlias = exports.getUserAlias()
  currentAlias[key] = aliasObj
  jsonOperator.writeFile(userSourcePath, { alias: currentAlias })
  console.log(textHelper.success(`now! you can use ${chalk.green('magic new ' + key)} to init the template ${chalk.green(value)}`))
}

exports.printList = function() {
  var officialAlias = exports.getOfficialAlias()
  var userAliases = exports.getUserAlias()
  console.log()
  console.log('  List of Alias:')
  console.log()
  console.log(`    # ${chalk.blue('Official set')}:`)
  Object.keys(officialAlias).forEach(function(key) {
    var aliasObj = officialAlias[key]
    console.log(`      ${chalk.green(key)} => ${chalk.yellow(aliasObj.value)}`)
    console.log(`        ${chalk.gray(aliasObj.description)}`)
  })
  console.log()
  console.log(`    # ${chalk.blue('You set')}:`)
  Object.keys(userAliases).forEach(function(key) {
    var aliasObj = userAliases[key]
    console.log(`      ${chalk.green(key)} => ${chalk.yellow(aliasObj.value)}`)
    console.log(`        ${chalk.gray(aliasObj.description)}`)
  })
}
