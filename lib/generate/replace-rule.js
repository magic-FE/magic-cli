exports.regex = /__([^_]+)__/g
exports.factory = function(replaceObj) {
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
