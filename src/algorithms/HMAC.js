'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('webcrypto')
const {TextEncoder} = require('text-encoding')
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
   * @param {string} data
   *
   * @returns {string}
   */
  sign (key, data) {
    let algorithm = this.params

    // TODO: validate key length

    data = new TextEncoder().encode(data)

    return crypto.subtle
      .sign(algorithm, key, data)
      .then(signature => base64url(Buffer.from(signature)))
  }

  /**
   * Verify
   *
   * @description
   * Verify a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {string} signature
   * @param {string} data
   *
   * @returns {Boolean}
   */
  verify (key, signature, data) {
    let algorithm = this.params

    if (typeof signature === 'string') {
      signature = Uint8Array.from(base64url.toBuffer(signature))
    }

    if (typeof data === 'string') {
      data = new TextEncoder().encode(data)
    }

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
