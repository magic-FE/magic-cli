#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var jsonOperater = require('jsonfile')
var sourcePath = require('../utils/source-path')
var officialSourcePath = sourcePath.officialSourcePath
var userSourcePath = sourcePath.userSourcePath
var path = require('path')

program
  .usage('<repo-name>/<alias-name> [<dianame>]')
  .option('-c, --clone', 'use git clone')
  .parse(process.argv)
  .on('--help', function() {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ magic new webpack dirname')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ magic new owner/repo dirname')
    console.log()
    console.log(chalk.gray('    # create a new project by alias name,it with mapping to a github template'))
    console.log('    $ magic new aliasName dirname')
    console.log()
  })

if (program.args.length < 1) program.help()

sourcePath.checkUserSourcePath()
  /**
   * some config
   */
var name = program.args[0]
var directory = program.args[1]

if (/^\w+$/.test(name)) { // isAlias？
  var userAlias = jsonOperater.readFileSync(userSourcePath)
  var officialAlias = jsonOperater.readFileSync(officialSourcePath)
  if (officialAlias[name]) {
    name = officialAlias[name]
  } else if (userAlias[name]) {
    name = userAlias[name]
  }
} else if (/^[./]|(\w:)/.test(directory)) {
  var templatePath = name.charAt(0) === '/' || /^\w:/.test(name) ? name : path.normalize(path.join(process.cwd(), name))
  
}












