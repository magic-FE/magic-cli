var program = require('commander')
var chalk = require('chalk')
var inquirer = require('inquirer')
var path = require('path')
var os = require('os')
var ora = require('ora')
var download = require('download-git-repo')
var exists = require('fs').existsSync

var pathHelper = require('../utils/path-helper')
var aliasHelper = require('../alias/alias-helper')

var textHelper = require('../utils/text-helper')

var generate = require('./generate')

program
  .usage('[options] <repo>/<alias> [dir]')
  .option('-r, --remote', 'Alwayls download remote template even if the local has a cache')
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
  .parse(process.argv)

if (program.args.length < 1) program.help()

pathHelper.checkUserSourcePath()

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
  var userAlias = aliasHelper.getUserAlias()
  var officialAlias = aliasHelper.getOfficialAlias()
  if (pathHelper.isAliasName(name)) { // isAlias？
    if (officialAlias[name]) {
      templateName = officialAlias[name].value
    } else if (userAlias[name]) {
      useAlias = true
      templateName = userAlias[name].value
    }
    if (templateName !== name) {
      textHelper.success(`Use alias ${chalk.green(name)} find template ${chalk.green(templateName)}`)
    } else {
      templateName = `${name}/${name}`
    }
  }
  if (pathHelper.isLocalPath(templateName)) { // isLocals?
    var templatePath = pathHelper.isAbsolutePath(templateName) ? templateName : path.resolve(templateName)
    generate(targetName, templatePath, targetFullPath)
  } else if (templateName.indexOf('/') > -1) { // repo?
    var templateCacheName = templateName.replace(/[:/#.]/g, '_')
    var tmp = path.join(os.tmpdir(), templateCacheName)
    if (exists(tmp) && !program.remote) {
      textHelper.success(`Use local cache template, you can add ${chalk.cyan('--remote')} option to update cache`)
      return generate(targetName, tmp, targetFullPath)
    }
    var spinner = ora(`Downloading template ${chalk.green(templateName)}...`)
    spinner.start()
    download(templateName, tmp, function(err) {
      spinner.stop()
      if (err) {
        console.log()
        textHelper.error(`Download template ${chalk.green(templateName)} error :`)
        console.log(err)
        if (err.statusCode === 404 && useAlias) {
          return inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            default: true,
            message: `alias ${chalk.red(name)} is not available, delete it?`
          }]).then(function(answer) {
            if (answer.delete) aliasHelper.deleteUserAlias(name)
          })
        }
        process.exit()
      }
      textHelper.success(`Download template ${chalk.green(templateName)} success! start to generate..`)
      generate(targetName, tmp, targetFullPath)
    })
  }
}
