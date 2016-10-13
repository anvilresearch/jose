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
const RSASSA_PKCS1_v1_5 = require('../../src/algorithms/RSASSA-PKCS1-v1_5')

/**
 * Tests
 */
describe('RSASSA_PKCS1_v1_5', () => {
  describe('constructor', () => {
    it('should set params')
  })

  describe('sign', () => {
    it('should return a promise')
    it('should reject an insufficient key length')
    it('should resolve a string')
    it('should resolve a base64url encoded value')
  })

  describe('verify', () => {
    it('should return a promise')
    it('should resolve a boolean')
  })

  describe('importKey', () => {
    it('should return a promise')
    it('should resolve a JWK')
    it('should resolve a JWK with CryptoKey property')
  })
})

