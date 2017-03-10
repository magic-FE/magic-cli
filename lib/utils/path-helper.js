var path = require('path')
var fs = require('fs')

var userSourcePath = path.join(require('os').homedir(), '.magicrc')
var textHelper = require('./text-helper')

exports.officialSourcePath = path.join(__dirname, '../../.magicrc')
exports.userSourcePath = userSourcePath

exports.aliasRegx = /^\w+$/
exports.localRelativePathRegx = /^[.]{1,2}\//
exports.localAbsolutePathRegx = /^([a-zA-Z]:)|^\//

exports.isAliasName = function(name) {
  return exports.aliasRegx.test(name)
}
exports.isRelativePath = function(path) {
  return exports.localRelativePathRegx.test(path)
}
exports.isAbsolutePath = function(path) {
  return exports.localAbsolutePathRegx.test(path)
}
exports.isLocalPath = function(path) {
  return exports.isRelativePath(path) || exports.isAbsolutePath(path)
}

exports.checkUserSourcePath = function() {
  try {
    if (!fs.existsSync(userSourcePath)) {
      fs.writeFileSync(userSourcePath, JSON.stringify({ alias: {} }))
    }
  } catch (err) {
    console.log()
    textHelper.error('Error:')
    console.log(err)
    process.exit()
  }
}
