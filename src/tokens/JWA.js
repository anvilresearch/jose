'use strict'

/**
 * Dependencies
 * @ignore
 */
const crypto = require('crypto')
const base64url = require('base64url')

/**
 * Regular Expressions
 */
const SUPPORTED_ALGORITHMS = /^(RS|ES|HS|PS)(256|384|512)$|^(none)$/i

/**
 * HMAC with SHA-2 Functions
 */
class HS {

  /**
   * Constructor
   */
  constructor (bitlength) {
    this.bitlength = bitlength
  }

  /**
   * Sign
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
   */
  verify (input, signature, key) {
    let computed = this.sign(input, key)
    return computed === signature
  }

  /**
   * Assert Sufficient Key Length
   */
  assertSufficientKeyLength (key) {
    if (key.length < bitlength) {
      throw new Error('The key is too short.')
    }
  }
}

/**
 * RSASSA-PKCS1-v1_5
 */
class RS {

  /**
   * Constructor
   */
  constructor (bitlength) {
    this.bitlength = bitlength
  }

  /**
   * Sign
   */
  sign (input, privateKey) {
    let {bitlength} = this
    let signer = crypto.createSign(`RSA-SHA${bitlength}`)
    signer.update(input)
    return base64url.fromBase64(signer.sign(privateKey))
  }

  /**
   * Verify
   */
  verify (input, signature, publicKey) {
    let {bitlength} = this
    let base64sig = base64url.toBase64(signature)
    let verifier = crypto.createVerify(`RSA-SHA${bitlength}`)
    verifier.update(input)
    return verifier.verify(publicKey, signature, 'base64')
  }
}

/**
 * ECDSA
 */
class ES {}

/**
 * RSASSA-PSS
 */
class PS {}

/**
 * "none" Algorithm
 */
class NONE {
  sign () {
    return ''
  }
}

/**
 * Algorithms Lookup Object
 */
const algorithms = { HS, RS, ES, PS, NONE }

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
