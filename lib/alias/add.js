var aliasTool = require('./alias-tools')
var sourcePath = require('../utils/source-path')
var path = require('path')
var check = require('./check')

module.exports = function(program) {
  var configName = program.args[0]
  var projectName = program.args[1]
  var description = program.desc
  check(configName)(function(configName) {
    if (sourcePath.aliasRegx.test(projectName)) {
      projectName = './' + projectName
    }
    if (sourcePath.localRelativePathRegx.test(projectName) && program.absolute) {
      projectName = path.resolve(projectName)
    }
    aliasTool.addUserAlias(configName, {
      value: projectName,
      description: description || ''
    })
  })
}
