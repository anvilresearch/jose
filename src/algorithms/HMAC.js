'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('webcrypto')
const {ab2buf} = require('../encodings')

/**
 * HMAC with SHA-2 Functions
 */
class HMAC {

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
   * Generate a hash-based message authentication code for a
   * given input and key. Enforce the key length is equal to
   * or greater than the bitlength.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {string}
   */
  sign (key, data) {
    let algorithm = this.params

    // validation required here?

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

  /**
   * Assert Sufficient Key Length
   *
   * @description Assert that the key length is sufficient
   * @param {string} key
   */
  assertSufficientKeyLength (key) {
    if (key.length < this.bitlength) {
      throw new Error('The key is too short.')
    }
  }
}

/**
 * Export
 */
module.exports = HMAC
