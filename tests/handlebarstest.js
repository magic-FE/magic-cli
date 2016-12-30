var hbs = require('handlebars')
hbs.registerHelper('eq', function(a, b, options) {
  if (arguments.length === 2) {
    options = b
    b = options.hash.compare
  }
  if (a === b) {
    return options.fn(this)
  }
  return options.inverse(this)
})
var fn = hbs.compile('{{#eq number compare=8}}A{{/eq}}')

console.log(fn({ number: 8 }))
