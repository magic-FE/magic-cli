var exists = require('fs').existsSync
var path = require('path')

var officialPath = path.join(__dirname, 'blueprints/')
var BLUE_PRINTS = 'blueprints'

function isRootPath(checkPath) {
  return /^[a-zA-Z]:[\\|/]$|^\/$/.test(path.resolve(checkPath))
}

function findBluePath(blueprintName) {
  var cwd = './'
  var bluePrintPath = path.join(officialPath, blueprintName)
  if (exists(bluePrintPath)) {
    return bluePrintPath
  }
  do {
    bluePrintPath = path.resolve(path.join(cwd, BLUE_PRINTS, blueprintName))
    if (exists(bluePrintPath)) {
      return bluePrintPath
    }
    cwd += '../'
  } while (!isRootPath(cwd))
  return null
}

function isBlueprintLegal(blueprintPath) {
  if (!exists(path.join(blueprintPath, 'files'))) {
    return 'The blueprint must contain files folder'
  }
  if (!exists(path.join(blueprintPath, 'index.js'))) {
    return 'The blueprint must contain index.js file'
  }
  return null
}
module.exports = function(blueprintName) {
  var blueprintPath = findBluePath(blueprintName)
  var checkResult = isBlueprintLegal(blueprintPath)
  if (checkResult) {
    throw new Error(checkResult)
  }
  return blueprintPath
}
