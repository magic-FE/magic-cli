#!/usr/bin/env node
require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .description(require('chalk').gray('### 😎  A magic cli'))
  .command('new', 'generate a new project from a template')
  .command('alias', 'config an alias of one template')
  .command('unalias', 'delete an alias')
  .parse(process.argv)
