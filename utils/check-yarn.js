exports.checkYarn = function() {
  try {
    require('child_process').execSync('yarn --version')
  } catch (e) {
    return false
  }
  return true
}
