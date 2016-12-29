#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var inquirer = require('inquirer')
var path = require('path')
var os = require('os')
var ora = require('ora')
var download = require('download-git-repo')

var sourcePath = require('../utils/source-path')
var officialSourcePath = sourcePath.officialSourcePath
var userSourcePath = sourcePath.userSourcePath

var shouldUpdate = require('../utils/should-update')
var textHelper = require('../utils/text-helper')
var execSync = require('child_process').execSync
var checkYarn = require('../utils/check-yarn')
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

var templateName = name
if (/^\w+$/.test(name)) { // isAlias？
  var userAlias = jsonOperater.readFileSync(userSourcePath)
  var officialAlias = jsonOperater.readFileSync(officialSourcePath)
  if (officialAlias[name]) {
    templateName = officialAlias[name]
  } else if (userAlias[name]) {
    templateName = userAlias[name]
  }
}

if (/^[./]|(\w:)/.test(templateName)) { // isLocals?
  var templatePath = templateName.charAt(0) === '/' || /^\w:/.test(templateName) ? templateName : path.normalize(path.join(process.cwd(), templateName))
  var spinner = ora('local template generating..')
  generate(targetName, templatePath, targetFullPath, function(err) {
    spinner.stop()
    if (err) return console.log(textHelper.error(`generate template error : ${err.message}, please re-run`))
    console.log()
    console.log(textHelper.success(`Generate success ${targetName}`))
  })
} else { // repo?
  shouldUpdate(function(lastVersion) {
    var isWindows = process.platform === 'win32'
    if (lastVersion) {
      inquirer.prompt([{
        type: 'confirm',
        name: 'isUpdate',
        message: `do you want to update to the ${chalk.green(lastVersion)} verison?`
      }]).then(function(answer) {
        if (answer.isUpdate) {
          var command = 'npm update -g magic-cli'
          command = isWindows ? command : `sudo ${command}`
          if (checkYarn()) {
            command = 'yarn global add magic-cli'
          }
          console.log(`$ ${command}`)
          execSync(command, { stdio: [0, 1, 2] })
          console.log(textHelper.success(`success !! updated to ${chalk.green('magic-cli' + lastVersion)}  please re-run! `))
        }
      })
    } else {
      var templateCacheName = templateName.slice(templateName.lastIndexOf(':') + 1).replace(/[\:\/\#\.]/g, '_') // eslint-disable-line
      var tmp = path.join(os.tmpdir(), templateCacheName)
      var spinner = ora('template downloading...')
      spinner.start()
      download(templateName, tmp, { clone: !!program.clone }, function(err) {
        spinner.stop()
        if (err) return console.log(textHelper.error(`dowload template error :  ${err.message}, please re-run`))
        console.log(textHelper.success('download template success!'))
        // spinner.text = 'template generating...'
        // spinner.start()
        generate(targetName, tmp, targetFullPath, function(err) {
          // spinner.stop()
          if (err) return console.log(textHelper.error(`generate template error : ${err.message}, please re-run`))
          console.log()
          console.log(textHelper.success(`Generate success ${targetName}`))
        })
      })
    }
  })
}
