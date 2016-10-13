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
const JWA = require('../../src/jose/JWA')

/**
 * Tests
 */
describe('JWA', () => {
  describe('sign', () => {
    it('should return a promise')
    it('should reject unsupported algorithm')
    it('should reject mismatching key')
    it('should resolve a signature')
  })

  describe('verify', () => {
    it('should return a promise')
    it('should reject unsupported algorithm')
    it('should reject mismatching key')
    it('should resolve a boolean')
  })
})
