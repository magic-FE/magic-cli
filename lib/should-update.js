var https = require('https')
var semver = require('semver')
var chalk = require('chalk')
var packageConfig = require('../package.json')

module.exports = function(done) {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log(chalk.red(
      `  You must upgrade node to >= ${packageConfig.engines.node}.x to use magic-cli`
    ))
  }
  https.get({
    host: 'registry.npmjs.org',
    path: '/magic-cli',
    timeout: 2000
  }, function(res) {
    var statusCode = res.statusCode
    if (statusCode !== 200) {
      var error = new Error(`Request Failed.\n` +
        `Status Code: ${statusCode}`)
      console.log(chalk.red(error.message))
      res.resume()
      return
    }
    var rawData = ''
    res.on('data', function(chunk) {
      rawData += chunk
    })
    res.on('end', function() {
      var parsedData = JSON.parse(rawData)
      var latestVersion = parsedData['dist-tags'].latest
      var localVersion = packageConfig.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow('  A newer version of magic-cli is available.'))
        console.log('============================================')
        console.log(`     latest: ${chalk.green(latestVersion)}`)
        console.log(`  installed: ${chalk.red(localVersion)}`)
        console.log('============================================')
        done(false)
      }
      done(true)
    })
  }).on('error', (e) => {
    console.log(chalk.red(`Got error: ${e.message}`))
    done(true)
  })
}
