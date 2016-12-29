var https = require('https')
var semver = require('semver')
var chalk = require('chalk')
var packageConfig = require('../package.json')
var registryUrl = require('registry-url')()
var url = require('url')
var urlObject = url.parse(registryUrl)
var textHelper = require('./text-helper')

module.exports = function(done) {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log(chalk.red(
      `  You must upgrade node to >= ${packageConfig.engines.node}.x to use magic-cli`
    ))
  }
  https.get({
    host: urlObject.host,
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
        console.log(textHelper.warning('  A newer version of magic-cli is available.'))
        console.log(textHelper.warning('============================================'))
        console.log(textHelper.warning(`     latest: ${chalk.green(latestVersion)}`))
        console.log(textHelper.warning(`  installed: ${chalk.red(localVersion)}`))
        console.log(textHelper.warning('============================================'))
        done(latestVersion)
      }
      done()
    })
  }).on('error', (e) => {
    console.log(textHelper.error(`Check version error, you can ignore, get some error: ${e.message}`))
    done()
  })
}
