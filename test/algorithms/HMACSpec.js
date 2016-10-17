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
const {TextEncoder} = require('text-encoding')
const crypto = require('webcrypto')
const base64url = require('base64url')

/**
 * Tests
 */
describe('HMAC', () => {

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should set params', () => {
      let alg = { name: 'HMAC' }
      let hmac = new HMAC(alg)
      hmac.params.should.equal(alg)
    })
  })

  /**
   * sign
   */
  describe('sign', () => {
    let alg, rawHmacKey, chromeHmacSignature, data, importedHmacKey

    before(() => {
      alg = { name: 'HMAC', hash: { name: 'SHA-256' } }

      rawHmacKey = new Uint8Array([
        137, 35, 38, 29, 130, 138, 121, 216, 20, 204, 169,
        61, 76, 80, 127, 140, 197, 193, 48, 6, 207, 97, 70,
        77, 57, 30, 72, 245, 249, 9, 204, 207, 215, 1, 53,
        33, 189, 28, 105, 9, 61, 158, 152, 113, 46, 83, 3,
        228, 234, 140, 20, 31, 192, 34, 254, 113, 117, 59,
        17, 78, 164, 52, 116, 38
      ])

      chromeHmacSignature = new Uint8Array([
        72, 73, 12, 66, 105, 131, 73, 116, 160, 243, 96, 121,
        121, 40, 244, 198, 107, 151, 113, 243, 51, 19, 60, 234,
        93, 23, 199, 14, 42, 118, 25, 161
      ])

      data = 'signed with Chrome generated webcrypto key'

      return crypto.subtle
        .importKey('raw', rawHmacKey, alg, true, ['sign', 'verify'])
        .then(cryptoKey => importedHmacKey = cryptoKey)
    })

    it('should return a promise', () => {
      let hmac = new HMAC(alg)
      return hmac.sign(importedHmacKey, data).should.be.instanceof(Promise)
    })

    it('should reject an insufficient key length')

    it('should resolve a base64url encoded value', () => {
      let hmac = new HMAC(alg)
      return hmac.sign(importedHmacKey, data)
        .then(signature => {
          base64url.toBuffer(signature)
            .should.eql(Buffer.from(chromeHmacSignature.buffer))
        })
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    let alg, rawHmacKey, chromeHmacSignature, signature, data, importedHmacKey

    before(() => {
      alg = { name: 'HMAC', hash: { name: 'SHA-256' } }

      rawHmacKey = new Uint8Array([
        137, 35, 38, 29, 130, 138, 121, 216, 20, 204, 169,
        61, 76, 80, 127, 140, 197, 193, 48, 6, 207, 97, 70,
        77, 57, 30, 72, 245, 249, 9, 204, 207, 215, 1, 53,
        33, 189, 28, 105, 9, 61, 158, 152, 113, 46, 83, 3,
        228, 234, 140, 20, 31, 192, 34, 254, 113, 117, 59,
        17, 78, 164, 52, 116, 38
      ])

      signature = 'SEkMQmmDSXSg82B5eSj0xmuXcfMzEzzqXRfHDip2GaE'
      data = 'signed with Chrome generated webcrypto key'

      return crypto.subtle
        .importKey('raw', rawHmacKey, alg, true, ['sign', 'verify'])
        .then(cryptoKey => importedHmacKey = cryptoKey)
    })

    it('should return a promise', () => {
      let hmac = new HMAC(alg)
      hmac.verify(importedHmacKey, signature, data).should.be.instanceof(Promise)
    })

    it('should resolve a boolean', () => {
      let hmac = new HMAC(alg)
      return hmac.verify(importedHmacKey, signature, data)
        .then(verified => {
          expect(verified).to.equal(true)
        })

    })
  })
})

