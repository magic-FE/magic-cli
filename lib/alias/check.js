var chalk = require('chalk')
var inquirer = require('inquirer')
var aliasHelper = require('./alias-helper')
var userAliases = aliasHelper.getUserAlias()

module.exports = checkIsLegal
/**
 * [checkIsLegal]
 * @param  {Function} done [callback]
 */
function checkIsLegal(configName) {
  return function(done) {
    var message = false
    if (/(\W)/g.test(configName)) {
      message = `Alias only contain word char${chalk.red('[A-Za-z0-9_]')}, please input another!`
    }
    if (message) {
      inquirer.prompt({
        name: 'alias',
        message: message,
        required: true,
        validate: function(input) {
          if (!input) {
            return 'You must input a alias'
          }
          return true
        },
        filter: function(input) {
          return input.replace(/\s/g, '')
        }
      }).then(function(answers) {
        configName = answers.alias
        checkIsLegal(configName)(done)
      })
    } else {
      checkIsExists(configName)(done)
    }
  }
}

/**
 * [checkIsExists]
 * @param  {Function} done [callback]
 */
function checkIsExists(configName) {
  return function(done) {
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
            return 'You must input a alias'
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
          checkIsLegal(configName)(done)
        } else {
          done(configName)
        }
      })
    } else {
      done(configName)
    }
  }
}
