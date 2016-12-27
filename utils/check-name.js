var registryUrl = require('registry-url')()
var urlObject = require('url').parse(registryUrl)
var chalk = require('chalk')
var https = require('https')
var validateName = require('validate-npm-package-name')
var inquirer = require('inquirer')

exports.checkNameIsExsits = checkNameIsExsits

function checkNameIsExsits(name) {
  return new Promise(function(resolve, reject) {
    https.get({
      host: urlObject.host,
      path: `/${name}`,
      timeout: 2000
    }, function(res) {
      var statusCode = res.statusCode
      if (statusCode === 404) {
        resolve(false)
      } else if (statusCode === 200) {
        resolve(true)
      } else {
        reject(`Request Failed.\n` +
          `Status Code: ${statusCode}`)
      }
    }).on('error', (e) => {
      console.log(chalk.red(`Got error: ${e.message}`))
      reject(e.message)
    })
  })
}

exports.askName = function(message, cb) {
  var prompts = [{
    name: 'name',
    message: message
  }, {
    type: 'confirm',
    name: 'askAgain',
    message: 'The name above already exists on npm, choose another?',
    default: true,
    when: function(answers) {
      return checkNameIsExsits(answers.name).then(function(available) {
        return !available
      })
    }
  }]
  inquirer.prompt(prompts, function(props) {
    if (props.askAgain) {
      return exports.askName(message, cb)
    }
    delete props.askAgain
    cb(props)
    return props
  })
}

exports.validateNameIsLegal = function(name) {
  var validateResults = validateName(name)
  if (!validateResults.validForNewPackages) {
    return `Sorry, ${(validateResults.errors || []).concat(validateResults.warnings || []).join('and')}`
  }
}
