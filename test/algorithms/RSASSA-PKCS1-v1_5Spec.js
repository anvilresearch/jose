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
const crypto = require('webcrypto')
const base64url = require('base64url')
const RSASSA_PKCS1_v1_5 = require('../../src/algorithms/RSASSA-PKCS1-v1_5')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey, RsaPrivateJwk} = require('../keys')

/**
 * Tests
 */
describe('RSASSA_PKCS1_v1_5', () => {

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should set params', () => {
      let alg = { name: 'RSASSA-PKCS1-v1_5' }
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      rsa.params.should.equal(alg)
    })
  })

  /**
   * sign
   */
  describe('sign', () => {
    let alg, rsa, data, chromeRsaSignature

    before(() => {
      alg = { name: "RSASSA-PKCS1-v1_5", hash: { name: 'SHA-256' } }
      rsa = new RSASSA_PKCS1_v1_5(alg)

      data = 'signed with Chrome webcrypto'

      chromeRsaSignature = new Uint8Array([
        84, 181, 186, 121, 235, 76, 199, 102, 174, 125, 176, 216, 94, 190,
        243, 201, 219, 114, 227, 61, 54, 194, 237, 14, 248, 204, 120, 109,
        249, 220, 229, 80, 44, 48, 86, 133, 96, 129, 85, 213, 70, 19, 126,
        0, 160, 91, 18, 185, 200, 102, 180, 181, 69, 27, 162, 181, 189, 110,
        188, 112, 124, 93, 57, 208, 91, 142, 182, 192, 87, 167, 193, 111,
        88, 5, 244, 108, 200, 150, 133, 68, 144, 208, 27, 155, 222, 213, 189,
        224, 156, 226, 124, 65, 178, 69, 71, 63, 243, 141, 3, 126, 209, 237,
        45, 179, 240, 255, 194, 245, 43, 148, 123, 97, 172, 239, 168, 221,
        44, 186, 72, 194, 29, 9, 171, 103, 125, 182, 39, 95, 163, 80, 3, 208,
        184, 184, 48, 114, 135, 7, 111, 114, 38, 25, 28, 234, 82, 18, 49, 113,
        20, 251, 59, 147, 206, 7, 134, 15, 189, 201, 253, 241, 120, 236, 58,
        235, 148, 27, 204, 233, 165, 31, 27, 223, 28, 10, 214, 159, 109, 186,
        239, 71, 126, 18, 63, 111, 198, 115, 226, 237, 145, 26, 12, 120, 56,
        166, 13, 195, 65, 11, 114, 149, 145, 255, 242, 97, 190, 255, 202, 219,
        144, 83, 238, 240, 182, 82, 165, 229, 118, 146, 29, 95, 127, 76, 188,
        247, 138, 254, 72, 18, 251, 42, 118, 156, 229, 66, 8, 106, 55, 106,
        83, 232, 234, 23, 195, 160, 167, 133, 14, 181, 126, 5, 36, 157, 2, 81,
        144, 83
      ])
    })

    it('should return a promise', () => {
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      rsa.sign(RsaPrivateCryptoKey, data).should.be.instanceof(Promise)
    })

    it('should reject an insufficient key length')

    it('should resolve a base64url encoded value', () => {
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      return rsa.sign(RsaPrivateCryptoKey, data)
        .then(signature => {
          base64url.toBuffer(signature)
            .should.eql(Buffer.from(chromeRsaSignature))
        })
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    let alg, rsa, data, signature

    before(() => {
      alg = { name: "RSASSA-PKCS1-v1_5", hash: { name: 'SHA-256' } }

      rsa = new RSASSA_PKCS1_v1_5(alg)

      data ='signed with Chrome webcrypto'

      signature = 'VLW6eetMx2aufbDYXr7zydty4z02wu0O-Mx4bfnc5VAsMFaFYIFV1UYTfgCgWxK5yGa0tUUborW9brxwfF050FuOtsBXp8FvWAX0bMiWhUSQ0Bub3tW94JzifEGyRUc_840DftHtLbPw_8L1K5R7YazvqN0sukjCHQmrZ322J1-jUAPQuLgwcocHb3ImGRzqUhIxcRT7O5POB4YPvcn98XjsOuuUG8zppR8b3xwK1p9tuu9HfhI_b8Zz4u2RGgx4OKYNw0ELcpWR__Jhvv_K25BT7vC2UqXldpIdX39MvPeK_kgS-yp2nOVCCGo3alPo6hfDoKeFDrV-BSSdAlGQUw'
    })

    it('should return a promise', () => {
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      rsa.verify(RsaPublicCryptoKey, signature, data)
        .should.be.instanceof(Promise)
    })

    it('should resolve a boolean', () => {
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      return rsa.verify(RsaPublicCryptoKey, signature, data)
        .then(verified => {
          verified.should.equal(true)
        })
    })
  })

  /**
   * importKey
   */
  describe('importKey', () => {
    let promise, result

    before(() => {
      let alg = { name: "RSASSA-PKCS1-v1_5", hash: { name: 'SHA-256' } }
      let rsa = new RSASSA_PKCS1_v1_5(alg)
      promise = rsa.importKey(RsaPrivateJwk).then(jwk => result = jwk)
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve a JWK', () => {
      result.should.eql(RsaPrivateJwk)
    })

    it('should resolve a JWK with CryptoKey property', () => {
      result.cryptoKey.constructor.name.should.equal('CryptoKey')
    })
  })
})

