
# magic-cli 中文文档

[![Build Status](https://travis-ci.org/magic-FE/magic-cli.svg?branch=master)](https://travis-ci.org/magic-FE/magic-cli)
[![npm package][npm]][npm-url]
[![node version][node]][node-url]
[![deps package][deps]][deps-url]
[![npm download][npm-download]][npm-download-url]
[![license][license]][license-url]
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/magic-FE/magic-cli)  

# 安装  
使用 [npm](https://npmjs.org) :  
```
 $ npm install -g magic-cli
```

使用 [yarn](https://yarnpkg.com/) :
```
 $ yarn global add magic-cli
```
# commands  
###  new
> 初始化一个项目

_选项_:
```
    > -c, --clone   # 使用 git clone 下载模板文件
    > -r, --remote  # 下载远程模板文件而不是使用本地缓存的模板文件
```

_说明_:  
这个命令是在[vue-cli](https://github.com/vuejs/vue-cli)的`init`的命令基础上面改的。有以下几个更改点:  
1. 增加了`alias`，也就是项目的别名的使用，初始化时会先去检查是否有别名  
2. 增加了缓存，`vue-cli`默认是在初始化完成后删除所下载的模板文件。修改后会缓存模板文件到系统的tmp目录。如果要更新换成或者是要下载从线上的模板文件进行初始化可以使用`--remote`或者`-r`选项。这样更新的模板文件会覆盖原来缓存的模板文件。  
PS：模板文件的渲染规则是使用的 [Handlebars.js](https://github.com/wycats/handlebars.js). 你可以具体参考它的语法。默认也注册了`if_eq`和`unless_eq`两个自定义命令


###  alias  
> 给远程(本地)模板添加一个别名

_选项_:
```
    > -l, --list        # 查看别名列表
    > -a, --absolute    # 如果是设置本地模板文件的路劲别名,默认是保存相对路劲,加了这个选项后会使用绝对路径
    > -d, --desc [desc] # 给别名添加描述，可以创建别名的时候添加，也可以在为已经存在的别名添加
```

###  unalias:
> 删除一个别名

###  g/generate:
> 在blueprints(模板)的基础上生成文件

_选项_:
```
    > -l, --list        # 查看蓝图文件列表
    > -c, --cwd [path]  # 生成文件的起始目录
    > -f, --force       # 如果生成的文件已经存在，直接覆盖。不询问用户是否覆盖
```
_说明_:  
这个命令是借鉴了[redux-cli](https://github.com/SpencerCDixon/redux-cli)的`generate`命令，但是实现方式不一样。在用它的命令时有很多不舒服的地方。在这个的基础上作了以下的修改  
1. `magic g` 在查找`blueprints` 模板文件的时候不只会找当前目录(运行命令的目录)，还会查找当前目录的上一层，以及上上层...这样就不用在每个目录都创建`blueprints`模板文件了  
2. 可以使用`-c,--cwd`选项来制定生成的目录  
3. 如果生成的文件已经存在则询问用户是否覆盖,而不是直接抛出错误
4. 增加了修饰符,如下：
- `__name.cap__`  或者 `__name.capitalize__`   => home to Home
- `__name.low__`  或者 `__name.lowercase__`   => Home to home
- `__name.up__`   或者 `__name.uppercase__`    => home to HOME
- `__name.dash__` 或者 `__name.dashcase__`  => homeName to home-name  




_例子_: 
> 如果你的blueprint文件是这样的  

```
    └── route            
      ├── index.js
      └── files
        └── __name__  
          ├── __name__Containers.js
          ├── __name__Components.js
          └── __name__Reducers.js
```

> 然后使用 `magic g`  

```
$ magic g route home
```

> 最后你会得到像这样的结果:  

```
    └── home
      ├── homeContainers.js
      ├── homeComponents.js
      └── homeReducers.js
```

_说明_:

同样的文件内部的 `__name__` 也会被替换。你可以在文件内部的内容使用它。
# Contents 
### Templates :

_未完成模板文件_, 你可以使用 [vue-cli template](https://github.com/vuejs/vue-cli#official-templates) 生成vue项目, `magic` 和它有一样的使用方法(api).

### Blueprints :
默认提供的blueprints文件  

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