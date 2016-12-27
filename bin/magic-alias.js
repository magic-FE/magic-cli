#!/usr/bin/env node
var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var path = require('path')
var inquirer = require('inquirer')
var sourcePath = path.join(__dirname, '../.magicrc')
var spinner = require('ora')('writing alias..')

program
  .usage('<alias-name> [project-name]')
  .description(chalk.gray('### 😃  Config an alias of one project'))
  .parse(process.argv)

if (program.args.length < 1) program.help()

if (program.args.length !== 2) {
  console.log(chalk.red(' error use, please see --help'))
  process.exit()
}
/**
 * check alias
 */

var alias = jsonOperater.readFileSync(sourcePath).alias
var userAliases = alias.user
var officialAliases = alias.official

var configName = program.args[0].replace(/\s/g, '')
var projectName = program.args[1].replace(/\s/g, '')

checkIsLegal(successCallback)

function successCallback() {
  alias.user[configName] = projectName
  var configData = { alias: alias }
  spinner.start()
  jsonOperater.writeFile(
      sourcePath,
      configData,
      function(err) {
        if (err) {
          spinner.text = `write alias error ${err.message}`
          spinner.fail()
        } else {
          spinner.text = (`Success!!
    set alias ${chalk.green(configName)} for project ${chalk.green(projectName)} success
    now! you can use ${chalk.green(`magic new ${configName}`)} to init the project ${chalk.green(projectName)} template
          `)
          spinner.succeed()
        }
      }
  )
}
function checkIsLegal(done) {
  var matches = configName.match(/(\W)/g)
  var message = false
  if (matches && matches.length) {
    message = `alias only contain word char${chalk.red('[A-Za-z0-9_]')}, please enter another!`
  } else if (officialAliases[configName]) {
    message = `"${chalk.red(configName)}" is a official alias. user alias must different from official alias,  please enter another!`
  }
  if (message) {
    inquirer.prompt({
      name: 'alias',
      message: message,
      required: true,
      validate: function(input) {
        if (!input) {
          return 'must enter a alias'
        }
        return true
      }
    }).then(function(answers) {
      configName = answers.alias.replace(/\s/g, '')
      checkIsLegal(done)
    })
  } else {
    checkIsExists(done)
  }
}

function checkIsExists(done) {
  if (userAliases[configName]) {
    inquirer.prompt([{
      name: 'enterAgain',
      type: 'confirm',
      message: `alias "${chalk.yellow(configName)}" is already exist, please enter another! if not, the old will be overwriten by the new..chose another?`,
      default: true
    }, {
      name: 'alias',
      message: `please enter another alias.`,
      validate: function(input) {
        if (!input) {
          return 'must enter a alias'
        }
        return true
      },
      when: function(answers) {
        return answers.enterAgain
      }
    }]).then(function(answers) {
      if (answers.enterAgain) {
        configName = answers.alias.replace(/\s/g, '')
        checkIsLegal(done)
      } else {
        done()
      }
    })
  } else {
    done()
  }
}
