var aliasHelper = require('./alias-helper')
var pathHelper = require('../utils/path-helper')
var path = require('path')
var check = require('./check')

module.exports = function(program) {
  var aliasName = program.args[0]
  var templatePath = program.args[1]
  var description = program.desc
  check(aliasName)(function(aliasName) {
    if (pathHelper.isAliasName(templatePath)) {
      templatePath = './' + templatePath // make templatePath to current path;
    }
    if (pathHelper.isRelativePath(templatePath) && !program.relative) {
      templatePath = path.resolve(templatePath)
    }
    aliasHelper.addUserAlias(aliasName, {
      value: templatePath,
      description: description || ''
    })
  })
}
