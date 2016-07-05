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
const KeyPair = require(path.join(cwd, 'src', 'jose', 'keys', 'KeyPair'))

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

    it('should define type of "pub"', () => {
      properties.pub.type.should.equal('object')
    })

    it('should define type of "prv"', () => {
      properties.prv.type.should.equal('object')
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
