var fs = require('fs')
var exists = fs.existsSync
var readdir = fs.readdirSync
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
exports.listOfBluePath = function(isOfficial) {
  var blueprints = []
  var absolute = officialPath
  if (isOfficial) {
    if (exists(officialPath)) {
      blueprints = readdir(officialPath)
    }
  } else {
    var cwd = './'
    do {
      absolute = path.resolve(path.join(cwd, BLUE_PRINTS))
      if (exists(absolute)) {
        blueprints = readdir(absolute)
        break
      }
      cwd += '../'
    } while (!isRootPath(cwd))
  }
  return blueprints.filter(function(blueprint) {
    return exists(path.join(absolute, blueprint, 'index.js')) && exists(path.join(absolute, blueprint, 'files'))
  }).map(function(blueprint) {
    return {
      cwd: absolute,
      name: blueprint,
      description: require(path.join(absolute, blueprint, 'index.js')).description
    }
  })
}
exports.printList = function() {
  console.log()
  console.log('  Available blueprints:')
  console.log()
  console.log(`    ${chalk.blue('Blueprint Source')} ==> ${chalk.green('nearest dir')}:`)
  exports.listOfBluePath().forEach(function(blueprint) {
    console.log(`      ${blueprint.name}  ${chalk.yellow('<name>')}`)
    console.log(`        ${chalk.gray(blueprint.description || '')}`)
  })
  console.log()
  console.log(`    ${chalk.blue('Blueprint Source')} ==> ${chalk.green('official dir')}:`)
  exports.listOfBluePath(true).forEach(function(blueprint) {
    console.log(`      ${blueprint.name}  ${chalk.yellow('<name>')}`)
    console.log(`        ${chalk.gray(blueprint.description || '')}`)
  })
}
