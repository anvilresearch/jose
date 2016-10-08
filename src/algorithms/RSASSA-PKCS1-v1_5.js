'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('webcrypto')
const {ab2buf, buf2ab, str2ab} = require('../encodings')

/**
 * RSASSA-PKCS1-v1_5
 */
class RSASSA_PKCS1_v1_5 {

  /**
   * constructor
   *
   * @param {string} bitlength
   */
  constructor (params) {
    this.params = params
  }

  /**
   * sign
   *
   * @description
   * Generate a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */
  sign (key, data) {
    let algorithm = this.params

    // TODO
    //if (!this.sufficientKeySize()) {
    //  return Promise.reject(
    //    new Error(
    //      'A key size of 2048 bits or larger must be used with RSASSA-PKCS1-v1_5'
    //    )
    //  )
    //}

    return crypto.subtle
      .sign(algorithm, key, data)
      .then(signature => base64url(ab2buf(signature)))
  }

  /**
   * verify
   *
   * @description
   * Verify a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} signature
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */
  verify (key, signature, data) {
    let algorithm = this.params

    // ...

    return crypto.subtle.verify(algorithm, key, signature, data)
  }

  /**
   * importKey
   *
   * @param {JWK} key
   * @returns {Promise}
   */
  importKey (key) {
    let jwk = Object.assign({}, key)
    let algorithm = this.params
    let usages = []

    if (key.use === 'sig') {
      usages.push('verify')
    }

    if (key.use === 'enc') {
      // TODO: handle encryption keys
      return Promise.resolve(key)
    }

    return crypto.subtle
      .importKey('jwk', jwk, algorithm, true, usages)
      .then(cryptoKey => {
        Object.defineProperty(jwk, 'cryptoKey', {
          enumerable: false,
          value: cryptoKey
        })

        return jwk
      })
  }
}

/**
 * Export
 */
module.exports = RSASSA_PKCS1_v1_5
