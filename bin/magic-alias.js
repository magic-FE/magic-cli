#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var inquirer = require('inquirer')
var textHelper = require('../utils/text-helper')

var aliasTool = require('../lib/alias-tools')

var sourcePath = require('../utils/source-path')
var path = require('path')

program
  .usage('<alias-name> <repo-name>/<template-dir>')
  .description(chalk.gray('### 😃  Config an alias of one template'))
  .option('-l, --list', 'list all alias')
  .option('-a, --absolute', 'if local add absolute path')
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
var args = program.args
var userAliases = aliasTool.getUserAlias()
var officialAlias = aliasTool.getOfficialAlias()
if (program.list) {
  console.log('  AliasList:')
  console.log(chalk.green('    # alias official set : '))
  Object.keys(officialAlias).forEach(function(key) {
    console.log(`     ${key} ==> ${officialAlias[key]}`)
  })
  console.log(chalk.green('    # alias you set : '))
  Object.keys(userAliases).forEach(function(key) {
    console.log(`     ${key} ==> ${userAliases[key]}`)
  })
  process.exit()
}

if (args.length < 1) program.help()

if (args.length !== 2) {
  console.log(textHelper.error('Error args!! please see --help'))
  process.exit()
}
sourcePath.checkUserSourcePath() // checkUserPath isExist?

/**
 * check alias
 */
var configName = program.args[0]
var projectName = program.args[1]

checkIsLegal(function(isAready) {
  if (isAready) {
    return console.log(textHelper.success(`Already!! now! you can use ${chalk.green('magic new ' + configName)} to init the template ${chalk.green(projectName)}`))
  }
  if (/^\w+$/.test(projectName)) {
    projectName = './' + projectName
  }
  if (/^[\.]{1,2}\//.test(projectName) && program.absolute) { // eslint-disable-line
    projectName = path.resolve(projectName)
  }
  aliasTool.addUserAlias(configName, projectName)
})

/**
 * [checkIsLegal]
 * @param  {Function} done [callback]
 */
function checkIsLegal(done) {
  var matches = configName.match(/(\W)/g)
  var message = false
  if (matches && matches.length) {
    message = `Alias only contain word char${chalk.red('[A-Za-z0-9_]')}, please input another!`
  } else if (officialAlias[configName]) {
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
