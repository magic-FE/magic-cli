var Handlebars = require('handlebars')
var match = require('minimatch')

module.exports = function(skipRender) {
  return function(files, metalsmith, done) {
    var keys = Object.keys(files)
    var answersAndOtherConfig = metalsmith.metadata()
    var mustachesRegx = /{{([^{}]+)}}/g
    keys.forEach(function(file, next) {
      if (skipRender && match(file, skipRender, { dot: true })) {
        return next()
      }
      var str = files[file].contents.toString()
      // do not attempt to render files that do not have mustaches
      if (!mustachesRegx.test(str)) {
        return next()
      }
      var template = Handlebars.compile(str)
      var res = template(answersAndOtherConfig)
      files[file].contents = new Buffer(res)
    })
  }
}