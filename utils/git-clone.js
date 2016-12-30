var execSync = require('child_process').execSync
var path = require('path')
var rm = require('rimraf').sync
  /**
   * @param {String} string
   * @return {url : clone url , checkout :  branch or tag}
   */

function getUrlAndCheckout(repo) {
  var regex = /^((github|gitlab|bitbucket):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$/
  var match = regex.exec(repo)
  var type = match[2] || 'github'
  var host = match[4] || null
  var owner = match[5]
  var name = match[6]
  var checkout = match[8] || 'master'

  if (host == null) {
    switch (type) {
      case 'gitlab':
        host = 'https://gitlab.com'
        break
      case 'github':
        host = 'https://github.com'
        break
      case 'bitbucket':
        host = 'https://bitbucket.com'
    }
  }
  return {
    url: host + '/' + owner + '/' + name + '.git',
    checkout: checkout
  }
}

module.exports = function(repo, targetPath, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  repo = getUrlAndCheckout(repo)
  var error = null
  try {
    execSync(`git clone -b ${repo.checkout} ${repo.url}`, { stdin: [0, 1, 2] })
  } catch (err) {
    error = err
  }
  if (!error && opts.delete) {
    rm(path.join(targetPath, '.git'))
  }
  if (typeof cb === 'function') cb(error)
}
