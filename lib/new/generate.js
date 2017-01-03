var Metalsmith = require('metalsmith')
var Handlebars = require('handlebars')
var path = require('path')
var collectAnswers = require('./middlewares/collect-answers')
var filterFiles = require('./middlewares/filter-files')
var renderTemplate = require('./middlewares/render-template')
var getOptions = require('./get-options')
var execSync = require('child_process').execSync
var checkYarn = require('./check-yarn')
var textHelper = require('../utils/text-helper')
var inquirer = require('inquirer')

var debug = require('debug')('magic:middlewares:generate')

// https://github.com/assemble/handlebars-helpers/blob/master/lib/comparison.js#L232
Handlebars.registerHelper('if_eq', function(a, b, options) {
  if (arguments.length === 2) {
    options = b
    b = options.hash.compare
  }
  return a === b ? options.fn(this) : options.inverse(this)
})

// https://github.com/assemble/handlebars-helpers/blob/master/test/comparison.js#L470
Handlebars.registerHelper('unless_eq', function(a, b, options) {
  if (arguments.length === 2) {
    options = b
    b = options.hash.compare
  }
  return a === b ? options.inverse(this) : options.fn(this)
})

module.exports = function generate(name, src, dest, done) {
  var opts = getOptions(name, src)
  var metalsmith = Metalsmith(path.join(src, 'template'))
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd()
  })
  opts.helpers && Object.keys(opts.helpers).map(function(key) {
    Handlebars.registerHelper(key, opts.helpers[key])
  })
  metalsmith
    .use(collectAnswers(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplate(opts.skipInterpolation))
    .clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function(err) {
      debug('finish render-template')
      if (err) return console.log(textHelper.error(`Generate template error : ${err.message}, please re-run`))
      console.log()
      console.log(textHelper.success(`Generate success!!`))
      inquirer.prompt([{
        type: 'confirm',
        name: 'install',
        default: true,
        message: `Project Generate success! install now?`
      }]).then(function(answer) {
        if (answer.install) {
          var cmd = 'npm install'
          if (checkYarn()) {
            cmd = 'yarn install'
          }
          if (!(dest === process.cwd())) {
            cmd = `cd ${name} && ${cmd}`
          }
          try {
            execSync(cmd, { stdio: [0, 1, 2] })
          } catch (err) {
            console.log(textHelper.error(`Install Error:${err.message}`))
            logMessage(opts.completeMessage, data)
            process.exit()
          }
          console.log()
          console.log(textHelper.success('Install success'))
        } else {
          logMessage(opts.completeMessage, data)
        }
      })
    })

  return data
}

function logMessage(message, data) {
  if (!message) return
  var res = message
  if (/{{([^{}]+)}}/g.test(message)) {
    res = Handlebars.compile(message)(data)
  }
  console.log('\n' + res.split(/\r?\n/g).map(function(line) {
    return '  ' + line
  }).join('\n'))
}
