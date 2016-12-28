#!/usr/bin/env node

var path = require('path')
var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var userSourcePath = path.join(require('os').homedir(), '.magicrc')
var exists = require('fs').existsSync
var spinner = require('ora')('writing alias..')
var textHelper = require('../utils/text-helper')

program
  .usage('<alias-name>')
  .description(chalk.gray('### 😭  Remove an alias'))
  .parse(process.argv)
  
if (program.args.length < 1) program.help()
if (program.args.length !== 1) {
  console.log(textHelper.error('Error args!! please see --help'))
  process.exit()
}

var unConfigName = program.args[0].replace(/\s/g, '')

if (!exists(userSourcePath)) {
  jsonOperater.writeFileSync(userSourcePath, { alias: {} })
}
var userAliases = jsonOperater.readFileSync(userSourcePath).alias

if (!userAliases[unConfigName]) {
  console.log(textHelper.warning(`Alias "${chalk.error(unConfigName)}" is not exits,you don't need to delete`))
} else {
  var projectName = userAliases[unConfigName]
  delete userAliases[unConfigName]
  var configData = { alias: userAliases }
  spinner.start()
  jsonOperater.writeFile(
    userSourcePath,
    configData,
    function(err) {
      spinner.stop()
      if (err) {
        console.log(textHelper.error(`Delete alias error ${err.message}`))
      } else {
        console.log(textHelper.success(`Success!! alias "${chalk.green(unConfigName)}=>${chalk.green(projectName)}" is already deleted`))
      }
    }
  )
}
