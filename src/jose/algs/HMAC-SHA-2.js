'use strict'

/**
 * Dependencies
 * @ignore
 */
const BaseAlgorithm = require('./BaseAlgorithm')
const base64url = require('base64url')
const crypto = require('crypto')

/**
 * HMAC with SHA-2 Functions
 */
class HMAC_SHA_2 extends BaseAlgorithm {

  /**
   * Constructor
   *
   * @param {string} bitlength
   */
  constructor (bitlength) {
    this.bitlength = bitlength
  }

  /**
   * Sign
   *
   * @description
   * Generate a hash-based message authentication code for a
   * given input and key. Enforce the key length is equal to
   * or greater than the bitlength.
   *
   * @param {string} input
   * @param {string|JWK} privateKey
   * @returns {string}
   */
  sign (input, key) {
    //assertSufficientKeyLength(key)
    let {bitlength} = this
    let hmac = crypto.createHmac(`sha${bitlength}`, key)
    hmac.update(input)
    return base64url.fromBase64(hmac.digest('base64'))
  }

  /**
   * Verify
   *
   * @description
   * Verify a digital signature for a given input and private key.
   *
   * @param {string} input
   * @param {string} signature
   * @param {string|JWK} publicKey
   * @returns {Boolean}
   */
  verify (input, signature, key) {
    let computed = this.sign(input, key)
    return computed === signature
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
module.exports = HMAC_SHA_2
