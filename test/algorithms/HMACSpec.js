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
const HMAC = require('../../src/algorithms/HMAC')

/**
 * Tests
 */
describe('HMAC', () => {
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
})

