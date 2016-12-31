#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var inquirer = require('inquirer')
var path = require('path')
var os = require('os')
var ora = require('ora')
var download = require('download-git-repo')
var exists = require('fs').existsSync

var sourcePath = require('../utils/source-path')
var officialSourcePath = sourcePath.officialSourcePath
var userSourcePath = sourcePath.userSourcePath
var aliasTools = require('../lib/alias-tools')

var shouldUpdate = require('../utils/should-update')
var textHelper = require('../utils/text-helper')

var generate = require('../lib/generate')

program
  .usage('<repo-name>/<alias-name> [<dianame>]')
  .option('-c, --clone', 'use git clone')
  .parse(process.argv)
  .on('--help', function() {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ magic new webpack dirname')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ magic new owner/repo dirname')
    console.log()
    console.log(chalk.gray('    # create a new project by alias name,it with mapping to a github template'))
    console.log('    $ magic new aliasName dirname')
    console.log()
  })

if (program.args.length < 1) program.help()

sourcePath.checkUserSourcePath()

/**
 * some config
 */
var name = program.args[0]
var directoryName = program.args[1]
var inPlace = !directoryName || directoryName === '.' // place exec cli, is in dest directory?

var targetName = inPlace ? path.relative('../', process.cwd()) : directoryName // the target directory
var targetFullPath = path.resolve(directoryName || '.') // target absolute path

if (exists(targetFullPath)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace ? 'Generate project in current directory?' : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(function(answers) {
    if (answers.ok) {
      start()
    }
  })
} else {
  start()
}

function start() {
  var templateName = name
  var useAlias = false
  var userAlias = jsonOperater.readFileSync(userSourcePath).alias
  var officialAlias = jsonOperater.readFileSync(officialSourcePath).alias
  if (/^\w+$/.test(name)) { // isAlias？
    if (officialAlias[name]) {
      templateName = officialAlias[name]
    } else if (userAlias[name]) {
      useAlias = true
      templateName = userAlias[name]
    }
    if (templateName !== name) {
      console.log(textHelper.success(`Use alias ${chalk.green(name)} find template ${chalk.green(templateName)}`))
    } else {
      templateName = `${name}/${name}`
    }
  }
  if (/^[./]|(\w:)/.test(templateName)) { // isLocals?
    var templatePath = templateName.charAt(0) === '/' || /^\w:/.test(templateName) ? templateName : path.normalize(path.join(process.cwd(), templateName))
    generate(targetName, templatePath, targetFullPath)
  } else if (templateName.indexOf('/') > -1) { // repo?
    shouldUpdate(function() {
      var templateCacheName = templateName.slice(templateName.lastIndexOf(':') + 1).replace(/[\:\/\#\.]/g, '_') // eslint-disable-line
      var tmp = path.join(os.tmpdir(), templateCacheName)
      var spinner = ora(`Downloading template ${chalk.green(templateName)}...`)
      spinner.start()
      download(templateName, tmp, { clone: !!program.clone }, function(err) {
        spinner.stop()
        if (err) {
          console.log(textHelper.error(`Download template ${chalk.green(templateName)} error :  ${err.message}`))
          if (err.statusCode === 404 && useAlias) {
            return inquirer.prompt([{
              type: 'confirm',
              name: 'delete',
              default: true,
              message: `alias ${chalk.red(name)} is not available, delete it?`
            }]).then(function(answer) {
              if (answer.delete) aliasTools.deleteUserAlias(name)
              process.exit()
            })
          }
          process.exit()
        }
        console.log(textHelper.success(`Download template ${chalk.green(templateName)} success! start to generate..`))
        generate(targetName, tmp, targetFullPath)
      })
    })
  }
}
