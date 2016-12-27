var async = require('async')
var inquirer = require('inquirer')
var askName = require('../../utils/check-name').askName

// Support types from prompt-for which was used before
var promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

/**
 * Inquirer prompt wrapper.
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */

function prompt(data, key, prompt, done) {
  if (prompt.when && !data[prompt.when]) {
    return done()
  }
  if (key === 'name') {
    askName(prompt.message || prompt.label || key, function(answers) {
      data.name = answers.name
      done()
    })
  } else {
    inquirer.prompt([{
      type: promptMapping[prompt.type] || prompt.type,
      name: key,
      message: prompt.message || prompt.label || key,
      default: prompt.default || '',
      choices: prompt.choices || [],
      validate: prompt.validate || function() {
        return true
      }
    }], function(answers) {
      if (Array.isArray(answers[key])) {
        data[key] = {}
        answers[key].forEach(function(multiChoiceAnswer) {
          data[key][multiChoiceAnswer] = true
        })
      } else {
        data[key] = answers[key]
      }
      done()
    })
  }
}

module.exports = function(prompts) {
  return function(files, metalsmith, done) {
    var data = metalsmith.metadata()
    async.eachSeries(Object.keys(prompts), function(key, next) {
      prompt(data, key, prompts[key], next)
    }, done)
  }
}
