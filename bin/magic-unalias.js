#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var source = require('../utils/source-path')
var aliasTools = require('../lib/alias-tools')

var textHelper = require('../utils/text-helper')

program
  .usage('<alias-name>')
  .description(chalk.gray('### 😭  Remove an alias'))
  .parse(process.argv)

if (program.args.length < 1) program.help()
if (program.args.length !== 1) {
  console.log(textHelper.error('Error args!! please see --help'))
  process.exit()
}
source.checkUserSourcePath()
aliasTools.deleteUserAlias(program.args[0])
