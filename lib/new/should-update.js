var https = require('https')
var semver = require('semver')
var chalk = require('chalk')
var registryUrl = require('registry-url')()
var url = require('url')
var urlObject = url.parse(registryUrl)
var ora = require('ora')

var textHelper = require('../utils/text-helper')
var packageConfig = require('../../package.json')
module.exports = function(done) {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log(textHelper.error(`You must upgrade node to >= ${packageConfig.engines.node}.x to use magic-cli`))
  }
  var spinner = ora('check magic-cli version...')
  spinner.start()
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
      spinner.stop()
      if (semver.lt(localVersion, latestVersion)) {
        console.log('A newer version of magic-cli is available.')
        console.log('=================================')
        console.log(`     latest: ${chalk.green(latestVersion)}`)
        console.log(`  installed: ${chalk.yellow(localVersion)}`)
        console.log('=================================')
      } else {
        console.log(textHelper.success(`The currently installed magic is the ${chalk.green('latest')} version`))
      }
      done()
    })
  }).on('error', (e) => {
    console.log(textHelper.error(`Check version error, you can ignore, get some error: ${e.message}`))
    done()
  })
}
