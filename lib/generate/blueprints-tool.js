var exists = require('fs').existsSync
var path = require('path')
var chalk = require('chalk')
var textHelper = require('../utils/text-helper')

var officialPath = path.join(__dirname, 'blueprints/')
var BLUE_PRINTS = 'blueprints'

function isRootPath(checkPath) {
  return /^[a-zA-Z]:[\\|/]$|^\/$/.test(path.resolve(checkPath))
}

function findBluePath(blueprintName) {
  var cwd = './'
  var blueprintPath = path.join(officialPath, blueprintName)
  if (exists(blueprintPath)) {
    return blueprintPath
  }
  do {
    blueprintPath = path.resolve(path.join(cwd, BLUE_PRINTS, blueprintName))
    if (exists(blueprintPath)) {
      return blueprintPath
    }
    cwd += '../'
  } while (!isRootPath(cwd))
  return null
}

function isBlueprintLegal(blueprintPath) {
  if (!exists(path.join(blueprintPath, 'files'))) {
    console.log(textHelper.error(`The blueprint ${chalk.red(blueprintPath)} must contain files folder`))
    process.exit()
  }
  if (!exists(path.join(blueprintPath, 'index.js'))) {
    console.log(textHelper.error(`The blueprint ${chalk.red(blueprintPath)} must contain index.js file`))
    process.exit()
  }
}
exports.findBluePath = function(blueprintName) {
  var blueprintPath = findBluePath(blueprintName)
  isBlueprintLegal(blueprintPath)
  return blueprintPath
}
