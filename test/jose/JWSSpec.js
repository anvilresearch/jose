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
const JWS = require('../../src/jose/JWS')

/**
 * Tests
 */
describe('JWS', () => {
  describe('sign', () => {
    describe('Compact Serialization', () => {
      it('should return a promise')
      it('should resolve a string')
      it('should resolve a signed JWT')
    })

    describe('JSON Serialization', () => {
      it('should return a promise')
      it('should resolve a string')
      it('should resolve a signed JWT')
    })

    describe('Flattened JSON Serialization', () => {
      it('should return a promise')
      it('should resolve a string')
      it('should resolve a signed JWT')
    })

    describe('Unsupported Serialization', () => {
      it('should return a promise')
      it('should reject a DataError')
    })
  })

  describe('verify', () => {
    describe('Compact Serialization', () => {
      it('should return a promise')
      it('should resolve the JWT')
      it('should set JWT verified property')
    })

    describe('multiple signature serialization', () => {
      it('should return a promise')
      it('should resolve the JWT')
      it('should set JWT verified property')
    })

    describe('missing signature(s)', () => {
      it('should return a promise')
      it('should reject a DataError')
    })
  })
})
