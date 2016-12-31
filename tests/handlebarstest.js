var inquirer = require('inquirer')
var handlebars = require('handlebars')

// var source = '{{#if theme}}{{theme}}{{/if}}'
handlebars.registerPartial('packages', `
  {{#each @root}}
  {{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}:{{#if this.version}}"{{this.version}}"{{else}}"lastest"{{/if}}
  {{#unless @last}},{{/unless}}{{/each}}
`)
var source3 = '{{> packages theme }}'
handlebars.registerHelper('$', function(context) {
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    return Object.keys(context)[0]
  } else {
    return context
  }
})
handlebars.registerHelper('has', function(context, b, options) {
  var a
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    a = Object.keys(context)
  } else if (context && Array.isArray(context)) {
    a = context
  } else if (typeof context === 'string') {
    a = [context]
  }
  return !~a.indexOf(b) ? options.inverse(this) : options.fn(this)
})
handlebars.registerHelper('packages', function(context, options) {
  var packages = {}
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    packages = context
  } else if (context && Array.isArray(context)) {
    context.forEach(function(key) {
      packages[key] = 'latest'
    })
  } else if (typeof context === 'string') {
    packages[context] = 'latest'
  }
  var str = new handlebars.SafeString(JSON.stringify(packages).replace(/[{}]/g, ''))

  if (Object.keys(packages).length) {
    str += options.fn(this)
  } else {
    str = options.inverse(this)
  }
  return str
})
var template = handlebars.compile('{{#packages name}},{{/packages}}')
var template3 = handlebars.compile('{{#has theme "antd"}}a{{/has}}')
inquirer.prompt([{
  type: 'list',
  choices: [{
    name: 'standard (https://github.com/feross/standard)',
    value: {
      'antd': '^2.8.0',
      'antd2': 'lastest'
    }
  }, 'antd-mobile', {
    name: 'eslint',
    value: ['eslint-standard', 'abc']
  }, {
    name: 'none',
    value: false
  }],
  message: 'Select which UI framework to install',
  name: 'name'
}]).then(function(answers) {
  console.log(template(answers))
})
