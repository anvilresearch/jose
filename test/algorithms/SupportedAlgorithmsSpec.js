'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const SupportedAlgorithms = require('../../src/algorithms/SupportedAlgorithms')

/**
 * Tests
 */
describe('SupportedAlgorithms', () => {
  describe('constructor', () => {
    it('should initialize registers', () => {
      let operations = SupportedAlgorithms.operations
      let supportedAlgorithms = new SupportedAlgorithms()
      operations.forEach(op => {
        supportedAlgorithms[op].should.eql({})
      })
    })
  })

  describe('static get operations', () => {
    it('should be an array of operations', () => {
      SupportedAlgorithms.operations.should.eql([
        'sign',
        'verify',
        'encrypt',
        'decrypt',
        'importKey'
      ])
    })
  })

  describe('define', () => {
    it('should register an algorithm for an operation', () => {
      let supportedAlgorithms = new SupportedAlgorithms()
      let argument = {}
      supportedAlgorithms.define('RS256', 'verify', argument)
      supportedAlgorithms.verify['RS256'].should.equal(argument)
    })
  })

  describe('normalize', () => {
    it('should return a registered algorithm for an operation by name', () => {
      let supportedAlgorithms = new SupportedAlgorithms()
      let argument = {}
      supportedAlgorithms.define('RS256', 'verify', argument)
      supportedAlgorithms.normalize('verify', 'RS256').should.equal(argument)
    })

    it('should throw NotSupportedError for unknown algorithms', () => {
      let supportedAlgorithms = new SupportedAlgorithms()
      let argument = {}

      expect(() => {
        supportedAlgorithms.normalize('verify', 'RS256').should.equal(argument)
      }).to.throw('RS256 is not a supported algorithm')
    })
  })
})

