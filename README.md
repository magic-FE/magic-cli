
# magic-cli  
> A tools to help you easily develop react(vue) project

[![Build Status](https://travis-ci.org/magic-FE/magic-cli.svg?branch=master)](https://travis-ci.org/magic-FE/magic-cli)
[![npm package][npm]][npm-url]
[![node version][node]][node-url]
[![deps package][deps]][deps-url]
[![npm download][npm-download]][npm-download-url]
[![npm package][license]][license-url]

# install  
With [npm](https://npmjs.org) do:  
```
 $ npm install -g magic-cli
```

With [yarn](https://yarnpkg.com/) do:
```
 $ yarn global add magic-cli
```
# commands  
###  new
> Init a project base on templates

_options_:
```
    > -c, --clone   # Use git clone to download template
    > -r, --remote  # Download remote template even if the local has a cache  
```

_note_: 
We render file use [Handlebars.js](https://github.com/wycats/handlebars.js). You can see it to write template


###  alias  
> Add an alias to the template

_options_:
```
    > -l, --list        # List all alias 
    > -a, --absolute    # If local add absolute path  
    > -d, --desc [desc] # Add some description for alias  
```

###  unalias:
> Delete an alias to the template

###  g/generate:
> Generate files base on blueprint  

_options_:
```
    > -l, --list        # list all blueprints
    > -c, --cwd [path]  # Assign  generate start path(work dir)
    > -f, --force       # overwrite the exsits file instead of ask  
```

_example_: 
> if you set a blueprint like this  

```
    └── route            
      ├── index.js
      └── files
        └── __name__  
          ├── __name__Containers.js
          ├── __name__Components.js
          └── __name__Reducers.js
```

> then use `magic g`  

```
$ magic g route home
```

> you will get result like this:  

```
    └── home
      ├── homeContainers.js
      ├── homeComponents.js
      └── homeReducers.js
```

_note_
Formats:

- `__name.cap__`  or `__name.capitalize__`   => home to Home
- `__name.low__`  or `__name.lowercase__`   => Home to home
- `__name.up__`   or `__name.uppercase__`    => home to HOME
- `__name.dash__` or `__name.dashcase__`  => HomeName to home-name

The files content also render by this rule , so you can write `__name__` will replace by `magic g` replace blueprint name
# Contents 
### Templates :

_Not finish, wait a moment_, you can use [vue-cli template](https://github.com/vuejs/vue-cli#official-templates) first, we has the same api like it.

### Blueprints :
|Name|Description|
|---|---|
|`magic g blueprint <name>`|generates a blueprint template file|



# License 

[MIT][license-url]

[npm]: https://img.shields.io/npm/v/magic-cli.svg
[npm-url]: https://www.npmjs.com/package/magic-cli

[node]: https://img.shields.io/node/v/magic-cli.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/magic-FE/magic-cli.svg
[deps-url]: https://david-dm.org/magic-FE/magic-cli

[npm-download-url]: https://npmjs.com/package/magic-cli
[npm-download]: https://img.shields.io/npm/dm/magic-cli.svg

[license-url]: https://github.com/magic-FE/magic-cli/blob/master/LICENSE
[license]: http://img.shields.io/npm/l/magic-cli.svg?style=flat