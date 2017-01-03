var program = require('commander')
var chalk = require('chalk')

var textHelper = require('../utils/text-helper')
var aliasTool = require('../utils/alias-tools')
var sourcePath = require('../utils/source-path')

var checkAndAdd = require('./check-alias')

program
  .usage('[options] <alias> <repo>/<dir>')
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
if (program.list) {
  var userAliases = aliasTool.getUserAlias()
  var officialAlias = aliasTool.getOfficialAlias()
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
  program.help()
}
sourcePath.checkUserSourcePath() // checkUserPath isExist?

checkAndAdd(program)
