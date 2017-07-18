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
const crypto = require('@trust/webcrypto')
const {TextEncoder} = require('text-encoding')
const base64url = require('base64url')
const AES_CBC = require('../../src/algorithms/AES-CBC')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey, RsaPrivateJwk} = require('../keys')

/**
 * Tests
 */
describe('AES-CBC', () => {

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should set params', () => {
      let alg = { name: 'AES-CBC', hash: { name: 'AES-CBC' } }
      let ec = new AES_CBC(alg)
      ec.params.should.equal(alg)
    })
  })

  /**
   * encrypt
   */
  describe('encrypt', () => {
    let alg, ec, data, key

    before(() => {
      alg = { name: "AES-CBC", hash: { name: 'AES-CBC'} }
      ec = new AES_CBC(alg)

      let promise = crypto.subtle.importKey(
            "jwk",
            {
                kty: "oct",
                k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
                alg: "A256CBC",
                ext: true,
            },
            {   // algorithm
                name: 'AES-CBC',
            },
            false, // extractable
            ["encrypt", "decrypt"] // usages
          )
      data = new TextEncoder().encode('encrypted with Chrome webcrypto')
      promise.then(result => { key = result })
    })

    it('should return a promise', () => {
      ec.encrypt(key, data).should.be.instanceof(Promise)
    })

    // it('should resolve a base64url encoded value', () => {
    //   ec.encrypt(key, data)
    //     .then(result => {console.log(result)})
    // })

    // it('should return a valid encryption', () => {
    //   return ec.encrypt(key, data)
    //     .then(ciphertext => {
    //       Buffer.from(ciphertext)
    //       .should.eql(Buffer.from(chromeEncryption))
    //     })
    // })
  })

  /**
   * verify
   */
  describe.skip('verify', () => {
    let alg, ec, data, signature

    before(() => {
      alg = { name: "ECDSA", namedCurve: 'K-256', hash: { name: 'SHA-256' } }

      ec = new ECDSA(alg)

      data ='signed with Chrome webcrypto'

      signature = 'VLW6eetMx2aufbDYXr7zydty4z02wu0O-Mx4bfnc5VAsMFaFYIFV1UYTfgCgWxK5yGa0tUUborW9brxwfF050FuOtsBXp8FvWAX0bMiWhUSQ0Bub3tW94JzifEGyRUc_840DftHtLbPw_8L1K5R7YazvqN0sukjCHQmrZ322J1-jUAPQuLgwcocHb3ImGRzqUhIxcRT7O5POB4YPvcn98XjsOuuUG8zppR8b3xwK1p9tuu9HfhI_b8Zz4u2RGgx4OKYNw0ELcpWR__Jhvv_K25BT7vC2UqXldpIdX39MvPeK_kgS-yp2nOVCCGo3alPo6hfDoKeFDrV-BSSdAlGQUw'
    })

    it('should return a promise', () => {
      let ec = new ECDSA(alg)
      ec.verify(RsaPublicCryptoKey, signature, data)
        .should.be.instanceof(Promise)
    })

    it('should resolve a boolean', () => {
      let ec = new ECDSA(alg)
      return ec.verify(RsaPublicCryptoKey, signature, data)
        .then(verified => {
          verified.should.equal(true)
        })
    })
  })

  /**
   * importKey
   */
  describe.skip('importKey', () => {
    let promise, result

    before(() => {
      let alg = { name: "ECDSA", namedCurve: 'K-256', hash: { name: 'SHA-256' } }
      let ec = new ECDSA(alg)
      promise = ec.importKey(RsaPrivateJwk).then(jwk => result = jwk)
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
