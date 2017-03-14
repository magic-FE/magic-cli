var semver = require('semver')
var validateName = require('validate-npm-package-name')
var Handlebars = require('handlebars')
var packageConfig = require('../../package.json')
var textHelper = require('../utils/text-helper')

exports.extend = Object.assign || require('util')._extend

exports.registHandlebarHelper = function(helpers) {
  helpers = exports.extend({}, {
    // https://github.com/assemble/handlebars-helpers/blob/master/lib/comparison.js#L232
    if_eq: function(a, b, options) {
      if (arguments.length === 2) {
        options = b
        b = options.hash.compare
      }
      return a === b ? options.fn(this) : options.inverse(this)
    },
    // https://github.com/assemble/handlebars-helpers/blob/master/lib/comparison.js#L232
    unless_eq: function(a, b, options) {
      if (arguments.length === 2) {
        options = b
        b = options.hash.compare
      }
      return a === b ? options.inverse(this) : options.fn(this)
    }
  }, helpers)

  helpers && Object.keys(helpers).forEach(function(key) {
    Handlebars.registerHelper(key, helpers[key])
  })
}

exports.checkNodeVersion = function(done) {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    textHelper.error(`You must upgrade node to >= ${packageConfig.engines.node}.x to use magic-cli`)
    return false
  }
  return true
}

exports.validateNameIsLegal = function(name) {
  var validateResults = validateName(name)
  if (!validateResults.validForNewPackages) {
    return `Sorry, ${(validateResults.errors || []).concat(validateResults.warnings || []).join('and')}`
  }
}
// exports.validateNameAndConsole = function(name) {
//   var message = exports.validateNameIsLegal(name)
//   if (message) {
//     textHelper.error(message)
//     return false
//   }
//   return true
// }

exports.hasYarn = function() {
  try {
    require('child_process').execSync('yarn --version')
  } catch (e) {
    return false
  }
  return true
}

const MUSTACHE_REGX = /{{([^{}]+)}}/g
exports.isMustacheTmp = function(content) {
  return MUSTACHE_REGX.test(content)
}

exports.handlebarsCompile = function(content, data) {
  return Handlebars.compile(content, { noEscape: true })(data)
}

exports.logMessage = function(message, data) {
  if (!message) return
  var res = message
  if (exports.isMustacheTmp(message)) {
    res = Handlebars.compile(message)(data)
  }
  console.log('\n' + res.split(/\r?\n/g).map(function(line) {
    return '  ' + line
  }).join('\n'))
}
