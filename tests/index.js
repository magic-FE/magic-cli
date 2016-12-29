var textHelper = require('../utils/text-helper')
var execSync = require('child_process').execSync
var chalk = require('chalk')
var command = `sudo npm install -g magic-cli`
var child = execSync(`command`, { stdio: [0, 1, 2] })
console.log(textHelper.success(`success !! updated to ${chalk.green('magic-cli@1.1.5')}  please re-run! `))
