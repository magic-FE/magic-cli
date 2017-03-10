var expect = require('chai').expect
var aliasHelper = require('../lib/alias/alias-helper')
var pathHelper = require('../lib/utils/path-helper')
var rm = require('rimraf')

describe('magic alias', function() {
  describe('#aliasHelper test', function() {
    it('#get user alias', function() {
      expect(aliasHelper.getUserAlias()).to.be.an('object')
    })
    it('#add and delete user alias', function(done) {
      rm(pathHelper.userSourcePath, function() {
        pathHelper.checkUserSourcePath()
        var alias = aliasHelper.getUserAlias()
        expect(alias).to.not.have.property('newAlias')
        aliasHelper.addUserAlias('newAlias', {
          value: 'test/test'
        })
        alias = aliasHelper.getUserAlias()
        expect(alias).to.have.property('newAlias')
        expect(alias.newAlias.value).to.equal('test/test')
        aliasHelper.deleteUserAlias('newAlias')
        alias = aliasHelper.getUserAlias()
        expect(alias).to.not.have.property('newAlias')
        done()
      })
    })
  })
})
