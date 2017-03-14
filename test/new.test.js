var expect = require('chai').expect
var fs = require('fs')
var exists = fs.existsSync
var readFile = fs.readFileSync
var inquirer = require('inquirer')
var _Promise = Promise || require('babel-runtime/core-js/promise')
var path = require('path')
var rm = require('rimraf').sync
var generate = require('../lib/new/generate')
var initHelper = require('../lib/new/init-helper')

function makeInquierCanExcute(answers) {
  inquirer.prompt = (questions, cb) => {
    const key = questions[0].name
    const _answers = {}
    const validate = questions[0].validate || function() {
      return true
    }
    const valid = validate(answers[key])
    if (valid !== true) {
      _Promise.reject(new Error(valid))
      throw new Error(valid)
    }
    _answers[key] = answers[key]
    if (typeof cb === 'function') cb(_answers)
    return _Promise.resolve(_answers)
  }
}

function readSync(path) {
  return readFile(path, { encoding: 'utf8' })
}

var FAKE_TEMPLATE_PATH = path.resolve('./test/fake-template/')
var BUILD_TARGET_PATH = path.resolve('./test/build-target/')
describe('magic new', function() {
  var answers = {
    name: 'test-new',
    attr1: 'abc',
    description: 'desc'
  }
  beforeEach(function() {
    rm(BUILD_TARGET_PATH)
  })
  it('#test basic generate', function(done) {
    makeInquierCanExcute(answers)
    generate('test-basic', FAKE_TEMPLATE_PATH, BUILD_TARGET_PATH, function(err) {
      expect(exists(BUILD_TARGET_PATH)).to.equal(true)
      done(err)
    })
  })
  describe('#test helper', function(done) {
    it('#if_eq', function(done) {
      makeInquierCanExcute(answers)
      generate('#if_eq', FAKE_TEMPLATE_PATH, BUILD_TARGET_PATH, function(err) {
        expect(readSync(path.join(BUILD_TARGET_PATH, 'PreInstallHelper.txt'))).to.equal('abc')
        done(err)
      })
    })
    it('#unless_eq', function(done) {
      var currentAnswers = initHelper.extend({}, answers, { attr1: 'abcd' })
      makeInquierCanExcute(currentAnswers)
      generate('#unless_eq', FAKE_TEMPLATE_PATH, BUILD_TARGET_PATH, function(error) {
        expect(readSync(path.join(BUILD_TARGET_PATH, 'PreInstallHelper.txt'))).to.equal('not_abc')
        done(error)
      })
    })
    it('#custom helper', function(done) {
      makeInquierCanExcute(answers)
      generate('#uppercase', FAKE_TEMPLATE_PATH, BUILD_TARGET_PATH, function(error) {
        expect(readSync(path.join(BUILD_TARGET_PATH, 'CustomHelper.txt'))).to.equal('abc')
        done(error)
      })
    })
  })
})
