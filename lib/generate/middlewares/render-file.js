function replaceFn(replaceObj) {
  return function(word) {
    word = word.replace(/__/g, '')
    var keys = word.split('.')
    var replaceStr = replaceObj[keys[0]]
    switch (keys[1]) {
      case 'cap':
      case 'capitalize':
        return replaceStr.charAt(0).toUpperCase() + replaceStr.slice(1)
      case 'low':
      case 'lowercase':
        return replaceStr.toLowerCase()
      case 'up':
      case 'uppercase':
        return replaceStr.toUpperCase()
      case 'dash':
      case 'dashcase':
        return replaceStr.replace(/([A-Z])/g, '-$1').toLowerCase()
      default:
        return replaceStr
    }
  }
}

module.exports = function(replaceObj) {
  return function(files, metalsmith, done) {
    var keys = Object.keys(files)
    var replaceRegx = /__([^_]+)__/g
    keys.forEach(function(file) {
      var compileFile = file
      if (replaceRegx.test(file)) {
        compileFile = file.replace(replaceRegx, replaceFn(replaceObj))
        if (compileFile !== file) {
          files[compileFile] = files[file]
          delete files[file]
        }
      }
      var str = files[compileFile].contents.toString()
      if (replaceRegx.test(str)) {
        files[compileFile].contents = new Buffer(str.replace(replaceRegx, replaceFn))
      }
    })
    done()
  }
}
