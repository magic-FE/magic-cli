var exists = require('fs').existsSync
var async = require('async')
var chalk = require('chalk')
var inquirer = require('inquirer')
var replaceRule = require('../replace-rule')
var path = require('path')

module.exports = function(replaceObj, force) {
  return function(files, metalsmith, done) {
    var keys = Object.keys(files)
    var replaceRegx = replaceRule.regex
    var replaceFn = replaceRule.factory(replaceObj)
    async.eachSeries(keys, function(file, next) {
      var compileFile = file
      if (replaceRegx.test(file)) {
        compileFile = file.replace(replaceRegx, replaceFn)
        files[compileFile] = files[file]
        delete files[file]
      }
      var absolutePath = path.join(metalsmith.destination(), compileFile)
      var relativePath = path.relative('.', absolutePath)
      if (!force && exists(absolutePath) && !(/(^|\/)\.[^/.]/g).test(compileFile)) {
        inquirer.prompt([{
          type: 'confirm',
          message: `file ${chalk.red(relativePath)} is already exists, overwrite it? `,
          default: false,
          name: 'overwrite'
        }]).then(function(answer) {
          if (!answer.overwrite) {
            delete files[compileFile]
          }
          next()
        })
      } else {
        next()
      }
    }, done)
  }
}
