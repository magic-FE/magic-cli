#!/usr/bin/env node

require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .description(require('chalk').gray('### 😎  A magic cli'))
  .command('new', 'Generates a new project from a template')
  .command('alias', 'Config an alias of one template')
  .command('unalias', 'Delete an alias')
  .command('generate', 'Generates code based off a blueprint')
  .command('g', 'Alias of generate')
  .parse(process.argv)
