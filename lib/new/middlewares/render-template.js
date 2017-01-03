var Handlebars = require('handlebars')
var match = require('minimatch')
var debug = require('debug')('magic:middlewares:render-template')

module.exports = function(skipRender) {
  return function(files, metalsmith, done) {
    debug('start render-template')
    var keys = Object.keys(files)
    var answersAndOtherConfig = metalsmith.metadata()
    var mustachesRegx = /{{([^{}]+)}}/g
    keys.forEach(function(file) {
      if (skipRender && match(file, skipRender, { dot: true })) {
        return
      }
      var str = files[file].contents.toString()
        // do not attempt to render files that do not have mustaches
      if (!mustachesRegx.test(str)) {
        return
      }
      var template = Handlebars.compile(str, { noEscape: true })
      var res = template(answersAndOtherConfig)
      if (file === 'package.json') {}
      files[file].contents = new Buffer(res)
    })
    done()
  }
}
