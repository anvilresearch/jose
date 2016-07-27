'use strict'

/**
 * Dependencies
 * @ignore
 */
const crypto = require('crypto')
const base64url = require('base64url')

/**
 * Algorithms
 */
const HS = require('../algs/HMAC-SHA-2')
const RS = require('../algs/RSASSA-PKCS1-v1_5')
const ES = require('../algs/ECDSA')
const PS = require('../algs/RSASSA-PSS')
const NONE = require('../algs/None')

/**
 * Algorithms Dictionary
 */
const algorithms = { HS, RS, ES, PS, NONE }

/**
 * Regular Expressions
 */
const SUPPORTED_ALGORITHMS = /^(RS|ES|HS|PS)(256|384|512)$|^(none)$/i

/**
 * JWA
 * https://tools.ietf.org/html/rfc7518
 */
class JWA {

  /**
   * Algorithms
   */
  static get algorithms () {
    return algorithms
  }

  /**
   * Sign
   */
  static sign (alg, input, key) {
    try {
      let match = alg.toUpperCase().match(SUPPORTED_ALGORITHMS)
      let [param,algorithm,bitlength] = match
      let signer = new algorithms[algorithm](bitlength)
      return signer.sign(input, key)
    } catch (e) {
      throw new Error('Unsupported algorithm for signatures')
    }
  }

  /**
   * Verify
   */
  static verify (alg, input, signature, key) {
    try {
      let match = alg.toUpperCase().match(SUPPORTED_ALGORITHMS)
      let [param,algorithm,bitlength] = match
      let verifier = new algorithms[algorithm](bitlength)
      return verifier.verify(input, signature, key)
    } catch (e) {
      throw new Error('Unsupported algorithm for signatures')
    }
  }

  /**
   * Encrypt
   */

  /**
   * Decrypt
   */
}

/**
 * Export
 */
module.exports = JWA
