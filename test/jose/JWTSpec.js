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
const JWT = require('../../src/jose/JWT')

/**
 * Tests
 */
describe('JWT', () => {
  describe('schema', () => {
    it('should return JWTSchema')
  })

  describe('static decode', () => {
    describe('non-string argument', () => {
      it('should reject with DataError')
    })

    describe('JWS JSON Serialization', () => {
      it('should return a promise')
      it('should reject malformed JWT')
      it('should resolve a JWT instance')
    })

    describe('JWS Flattened JSON Serialization', () => {
      it('should return a promise')
      it('should reject malformed JWT')
      it('should resolve a JWT instance')
    })

    describe('JWS Compact Serialization', () => {
      it('should return a promise')
      it('should reject malformed JWT')
      it('should resolve a JWT instance')
      it('should set JWT type')
      it('should set JWT segments')
      it('should set JWT header')
      it('should set JWT payload')
      it('should set JWT signature')
      it('should set JWT serialization')
    })
  })

  describe('static encode', () => {})
  describe('static sign', () => {})
  describe('static verify', () => {})

  describe('isJWE', () => {
    it('should return true with "enc" header')
    it('should return false without "enc" header')
  })

  describe('encode', () => {
    it('should return a promise')
    it('should reject invalid JWT')
    it('should resolve a string')
    it('should resolve a JWS Compact Serialization')
  })

  describe('verify', () => {
    it('should return a promise')
    it('should reject invalid JWT')
    it('should resolve a boolean')
  })
})
