var https = require('https')
var semver = require('semver')
var chalk = require('chalk')
var registryUrl = require('registry-url')()
var execSync = require('child_process').execSync
var url = require('url')
var urlObject = url.parse(registryUrl)
var inquirer = require('inquirer')

var textHelper = require('./text-helper')
var checkYarn = require('../utils/check-yarn')
var packageConfig = require('../package.json')
module.exports = function(done) {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log(textHelper.error(`You must upgrade node to >= ${packageConfig.engines.node}.x to use magic-cli`))
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
        console.log('  A newer version of magic-cli is available.')
        console.log('============================================')
        console.log(`     latest: ${chalk.green(latestVersion)}`)
        console.log(`  installed: ${chalk.yellow(localVersion)}`)
        console.log('============================================')
        var isWindows = process.platform === 'win32'
        return inquirer.prompt([{
          type: 'confirm',
          name: 'isUpdate',
          message: `Do you want to update to the ${chalk.green(latestVersion)} verison?`
        }]).then(function(answer) {
          if (answer.isUpdate) {
            var command = 'npm update -g magic-cli'
            command = isWindows ? command : `sudo ${command}`
            if (checkYarn()) {
              command = 'yarn global add magic-cli'
            }
            console.log(`$ ${command}`)
            execSync(command, { stdio: [0, 1, 2] })
            console.log(textHelper.success(`Success !! updated to ${chalk.green('magic-cli@' + latestVersion)}  please re-run! `))
          } else {
            done()
          }
        })
      }
      done()
    })
  }).on('error', (e) => {
    console.log(textHelper.error(`Check version error, you can ignore, get some error: ${e.message}`))
    done()
  })
}
