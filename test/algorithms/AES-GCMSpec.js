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
const base64url = require('base64url')
const AES_GCM = require('../../src/algorithms/AES-GCM')
const A128GCMKey = {
  kty: "oct",
  k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
  alg: "A256GCM",
  ext: true,
}

/**
 * Tests
 */
describe('AES-GCM', () => {

  let alg, ec, encryptedData

  before(() => {
    alg = { name: 'AES-GCM', length: 128, tagLength: 128 }
    ec = new AES_GCM(alg)
  })

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should set params', () => {
      ec.params.should.equal(alg)
    })
  })

  /**
   * encrypt
   */
  describe('encrypt', () => {
    let data, key

    before(() => {
      let promise = crypto.subtle.importKey(
                    "jwk",
                    {
                      kty: "oct",
                      k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
                      alg: "A256GCM",
                      ext: true,
                    },
                    {   // algorithm
                      name: "AES-GCM",
                    },
                    false, // extractable
                    ["encrypt", "decrypt"] // usages
                  )
      data = 'encrypted with Chrome webcrypto'
      promise.then(result => { key = result })
    })

    it('should return a promise', () => {
      ec.encrypt(key, data).should.be.instanceof(Promise)
    })

    it('should perform encryption', () => {
      return ec.encrypt(key, data)
        .then(result => {
          encryptedData = result
          result.should.not.eql(Buffer.from(data))
        })
    })
  })

  /**
   * decrypt
   */
   describe('decrypt', () => {
     let key, data

     before(() => {
       let promise = crypto.subtle.importKey(
                     "jwk",
                     A128GCMKey,
                     {   // algorithm
                       name: "AES-GCM",
                     },
                     false, // extractable
                     ["encrypt", "decrypt"] // usages
                   )
       data = 'encrypted with Chrome webcrypto'
       promise.then(result => { key = result })
     })

     it('should return a promise', () => {
       ec.decrypt(key, encryptedData.ciphertext,
         encryptedData.iv, encryptedData.tag)
       .should.be.instanceof(Promise)
     })

     it('should recover plaintext', () => {
       return ec.decrypt(key, encryptedData.ciphertext,
         encryptedData.iv, encryptedData.tag)
       .then(result => {
         result.should.eql(data)
       })
     })

   })

  /**
   * importKey
   */
  describe('importKey', () => {
    let promise, result

    before(() => {
      promise = ec.importKey(A128GCMKey).then(jwk => result = jwk)
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve a JWK', () => {
      result.should.eql(A128GCMKey)
    })

    it('should resolve a JWK with CryptoKey property', () => {
      result.cryptoKey.constructor.name.should.equal('CryptoKey')
    })
  })
})
