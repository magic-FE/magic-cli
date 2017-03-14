var expect = require('chai').expect
var aliasHelper = require('../lib/alias/alias-helper')
var pathHelper = require('../lib/utils/path-helper')
var rm = require('rimraf')

describe('magic alias', function() {
  describe('#aliasHelper test', function() {
    it('#get user alias', function() {
      pathHelper.checkUserSourcePath()
      expect(aliasHelper.getUserAlias()).to.be.an('object')
    })
    it('#add and delete user alias', function(done) {
      var ALIAS_NAME = 'Test_Name'
      var ALIAS_VALUE = 'Test/Test'
      rm(pathHelper.userSourcePath, function() {
        pathHelper.checkUserSourcePath()
        var alias = aliasHelper.getUserAlias()
        expect(alias).to.not.have.property(ALIAS_NAME)

        aliasHelper.addUserAlias(ALIAS_NAME, {
          value: ALIAS_VALUE
        })
        alias = aliasHelper.getUserAlias()
        expect(alias).to.have.property(ALIAS_NAME)
        expect(alias[ALIAS_NAME].value).to.equal(ALIAS_VALUE)

        aliasHelper.deleteUserAlias(ALIAS_NAME)
        alias = aliasHelper.getUserAlias()
        expect(alias).to.not.have.property(ALIAS_NAME)
        done()
      })
    })
  })
})
