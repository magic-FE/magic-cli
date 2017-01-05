var replaceRule = require('../replace-rule')

module.exports = function(replaceObj) {
  return function(files, metalsmith, done) {
    var replaceRegx = replaceRule.regex
    Object.keys(files).forEach(function(file) {
      var str = files[file].contents.toString()
      if (replaceRegx.test(str)) {
        files[file].contents = new Buffer(str.replace(replaceRegx, replaceRule.factory(replaceObj)))
      }
    })
    done()
  }
}
