#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var inquirer = require('inquirer')
var spinner = require('ora')('writing alias..')
var textHelper = require('../utils/text-helper')

var sourcePath = require('../utils/source-path')
var officialSourcePath = sourcePath.officialSourcePath
var userSourcePath = sourcePath.userSourcePath

program
  .usage('<alias-name> <repo-name>/<template-dir>')
  .description(chalk.gray('### 😃  Config an alias of one template'))
  .parse(process.argv)
  .on('--help', function() {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # config an alias for a github template'))
    console.log('    $ magic alias aliasName owner/repo')
    console.log()
    console.log(chalk.gray('    # after one setting, you can create a new project straight from the alias'))
    console.log('    $ magic new aliasName dirname')
    console.log()
  })

if (program.args.length < 1) program.help()

if (program.args.length !== 2) {
  console.log(textHelper.error('Error args!! please see --help'))
  process.exit()
}

sourcePath.checkUserSourcePath() // checkUserPath isExist?
/**
 * check alias
 */
var officialAliases = jsonOperater.readFileSync(officialSourcePath).alias
var userAliases = jsonOperater.readFileSync(userSourcePath).alias
var configName = program.args[0]
var projectName = program.args[1]

checkIsLegal(successCallback)

function successCallback(isAready) {
  if (isAready) {
    return console.log(textHelper.success(`Already!! now! you can use ${chalk.green(`magic new ${configName}`)} to init the template ${chalk.green(projectName)}`))
  }
  userAliases[configName] = projectName
  var configData = { alias: userAliases }
  spinner.start()
  jsonOperater.writeFile(
      userSourcePath,
      configData,
      function(err) {
        spinner.stop()
        if (err) {
          console.log(textHelper.error(`Write alias error ${err.message}`))
        } else {
          console.log(textHelper.success(`Success!! now! you can use ${chalk.green(`magic new ${configName}`)} to init the template ${chalk.green(projectName)}`))
        }
      }
  )
}
/**
 * [checkIsLegal]
 * @param  {Function} done [callback]
 */
function checkIsLegal(done) {
  var matches = configName.match(/(\W)/g)
  var message = false
  if (matches && matches.length) {
    message = `Alias only contain word char${chalk.red('[A-Za-z0-9_]')}, please input another!`
  } else if (officialAliases[configName]) {
    message = `The "${chalk.red(configName)}" is a official alias. please input another!`
  }
  if (message) {
    inquirer.prompt({
      name: 'alias',
      message: message,
      required: true,
      validate: function(input) {
        if (!input) {
          return 'Must input a alias'
        }
        return true
      },
      filter: function(input) {
        return input.replace(/\s/g, '')
      }
    }).then(function(answers) {
      configName = answers.alias
      checkIsLegal(done)
    })
  } else {
    checkIsExists(done)
  }
}
/**
 * [checkIsExists]
 * @param  {Function} done [callback]
 */
function checkIsExists(done) {
  if (userAliases[configName] === projectName) return done(true)
  if (userAliases[configName]) {
    inquirer.prompt([{
      name: 'enterAgain',
      type: 'confirm',
      message: `Alias "${chalk.yellow(configName)}" is already exist, input another?`,
      default: true
    }, {
      name: 'alias',
      message: `Please input another alias.`,
      validate: function(input) {
        if (!input) {
          return 'Must input a alias'
        }
        return true
      },
      when: function(answers) {
        return answers.enterAgain
      },
      filter: function(input) {
        return input.replace(/\s/g, '')
      }
    }]).then(function(answers) {
      if (answers.enterAgain) {
        configName = answers.alias
        checkIsLegal(done)
      } else {
        done()
      }
    })
  } else {
    done()
  }
}
