var chalk = require('chalk')
var inquirer = require('inquirer')
var textHelper = require('../utils/text-helper')

var aliasTool = require('../utils/alias-tools')
var sourcePath = require('../utils/source-path')
var path = require('path')

module.exports = function(program) {
  var configName = program.args[0]
  var projectName = program.args[1]
  var userAliases = aliasTool.getUserAlias()
  var officialAlias = aliasTool.getOfficialAlias()
  checkIsLegal(function(isAready) {
    if (isAready) {
      return console.log(textHelper.success(`Already!! now! you can use ${chalk.green('magic new ' + configName)} to init the template ${chalk.green(projectName)}`))
    }
    if (sourcePath.aliasRegx.test(projectName)) {
      projectName = './' + projectName
    }
    if (sourcePath.localAbsolutePathRegx.test(projectName) && program.absolute) {
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
}
