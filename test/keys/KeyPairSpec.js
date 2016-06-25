'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const KeyPair = require(path.join(cwd, 'src', 'keys', 'KeyPair'))

/**
 * Tests
 */
describe('KeyPair', () => {

  /**
   * Schema
   */
  describe('schema', () => {
    let {schema: {properties}} = KeyPair

    it('should define type of "type"', () => {
      properties.type.type.should.equal('string')
    })

    it('should define enum of "type"', () => {
      properties.type.enum.should.eql(['RSA', 'EC'])
    })

    it('should define type of "jwk"', () => {
      properties.jwk.type.should.equal('object')
    })

    it('should define type of "jwk.pub"', () => {
      properties.jwk.properties.pub.type.should.equal('object')
    })

    it('should define type of "jwk.prv"', () => {
      properties.jwk.properties.prv.type.should.equal('object')
    })

    it('should define type of "pem"', () => {
      properties.pem.type.should.equal('object')
    })

    it('should define type of "pem.pub"', () => {
      properties.pem.properties.pub.type.should.equal('string')
    })

    it('should define type of "pem.prv"', () => {
      properties.pem.properties.prv.type.should.equal('string')
    })
  })

  /**
   * Generate
   */
  describe('generate', () => {
    it('should throw an error', () => {
      expect(() => KeyPair.generate()).to.throw(
        'KeyPair generate method must be implemented by extending class'
      )
    })
  })
})
