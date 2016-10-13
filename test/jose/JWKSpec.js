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
const JWK = require('../../src/jose/JWK')

/**
 * Tests
 */
describe('JWK', () => {
  describe('schema', () => {
    it('should return JWKSchema')
  })

  describe('importKey', () => {
    it('should return a promise')
    it('should resolve a JWK')
    it('should resolve a JWK with CryptoKey property')
  })
})
