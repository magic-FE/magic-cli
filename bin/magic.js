#!/usr/bin/env node
require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .description(require('chalk').gray('### 😎  A magic cli'))
  .command('init', 'generate a new project from a template')
  .command('list', 'list available official templates and local templates')
  .command('alias', 'config an alias of one project')
  .parse(process.argv)
