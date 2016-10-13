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
const JWKSet = require('../../src/jose/JWKSet')

/**
 * Tests
 */
describe('JWKSet', () => {
  describe('schema', () => {
    it('should return JWKSetSchema')
  })

  describe('importKeys', () => {
    it('should return a promise')
    it('should reject invalid JWK Set')
    it('should resolve imported JWKs')
  })
})
