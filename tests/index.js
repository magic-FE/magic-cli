var inquirer = require('inquirer')

var prompts = [{
  type: 'input',
  name: 'name',
  message: 'enter a name!',
  validate: function(input) {
    if (input === 'abc') {
      return inquirer.prompt([{
        type: 'confirm',
        name: 'askAgain',
        message: 'The name above already exists on npm, choose another?',
        default: true
      }]).then(function(props) {
        if (props.askAgain) {
          inquirer.prompt(prompts).then(function(props) {
            console.log(props)
          })
        }
      })
    }
    return true
  }
}]

inquirer.prompt(prompts).then(function(props) {
  console.log(props)
})
