var Metalsmith = require('metalsmith')
var path = require('path')
var collectAnswers = require('./middlewares/collect-answers')
var filterFiles = require('./middlewares/filter-files')
var renderTemplate = require('./middlewares/render-template')
var getOptions = require('./get-options')
var execSync = require('child_process').execSync
var textHelper = require('../utils/text-helper')
var inquirer = require('inquirer')
var initHelper = require('./init-helper')

module.exports = function generate(name, src, dest, cb) {
  if (!cb) {
    cb = function() {}
  }
  var opts = getOptions(name, src)
  var metalsmith = Metalsmith(path.join(src, opts.templateDir || 'template'))
  var data = initHelper.extend(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd()
  })
  if (!initHelper.checkNodeVersion()) {
    return
  }
  initHelper.registHandlebarHelper(opts.helpers)
  metalsmith
    .use(collectAnswers(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplate(opts.skipInterpolation))
    .clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function(err) {
      if (err) {
        cb(err)
        textHelper.error('Generate Error:')
        console.log()
        return console.log(err)
      }
      cb()
      console.log()
      textHelper.success(`Generate success`)
      inquirer.prompt([{
        type: 'confirm',
        name: 'install',
        default: false,
        message: `Project Generate success! install now?`
      }]).then(function(answer) {
        if (answer.install) {
          var cmd = 'npm install'
          if (initHelper.hasYarn()) {
            cmd = 'yarn install'
          }
          if (!(dest === process.cwd())) {
            cmd = `cd ${name} && ${cmd}`
          }
          try {
            execSync(cmd, { stdio: [0, 1, 2] })
          } catch (err) {
            textHelper.error('Install Error:')
            console.log()
            console.log(err)
            initHelper.logMessage(opts.completeMessage, data)
            process.exit()
          }
          console.log()
          textHelper.success('Install success')
        } else {
          initHelper.logMessage(opts.completeMessage, data)
        }
      })
    })

  return data
}
