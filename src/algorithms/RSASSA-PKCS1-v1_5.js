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
   * Constructor
   *
   * @param {string} bitlength
   */
  constructor (params) {
    this.params = params
  }

  /**
   * Sign
   *
   * @description
   * Generate a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {string}
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
   * Verify
   *
   * @description
   * Verify a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} signature
   * @param {BufferSource} data
   *
   * @returns {Boolean}
   */
  verify (key, signature, data) {
    let algorithm = this.params

    // ...

    return crypto.subtle.verify(algorithm, key, signature, data)
  }

}

/**
 * Export
 */
module.exports = RSASSA_PKCS1_v1_5
