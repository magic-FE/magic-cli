var Metalsmith = require('metalsmith')
var Handlebars = require('handlebars')
var path = require('path')
var collectAnswers = require('./middlewares/collect-answers')
var filterFiles = require('./middlewares/filter-files')
var renderTemplate = require('./middlewares/render-template')
var getOptions = require('../utils/get-options')
var debug = require('debug')('magic:middlewares:generate')

module.exports = function generate(name, src, dest, done) {
  var opts = getOptions(name, src)
  var metalsmith = Metalsmith(path.join(src, 'template'))
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
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
      done(err)
      logMessage(opts.completeMessage, data)
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
