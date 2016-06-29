'use strict'

/**
 * Dependencies
 * @ignore
 */
const BaseAlgorithm = require('./BaseAlgorithm')
const base64url = require('base64url')
const crypto = require('crypto')

/**
 * RSASSA-PKCS1-v1_5
 */
class RSASSA_PKCS1_v1_5 extends BaseAlgorithm {

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
   * Generate a digital signature for a given input and private key.
   *
   * @param {string} input
   * @param {string|JWK} privateKey
   * @returns {string}
   */
  sign (input, privateKey) {
    let {bitlength} = this
    let signer = crypto.createSign(`RSA-SHA${bitlength}`)
    signer.update(input)
    return base64url.fromBase64(signer.sign(privateKey))
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
  verify (input, signature, publicKey) {
    let {bitlength} = this
    let base64sig = base64url.toBase64(signature)
    let verifier = crypto.createVerify(`RSA-SHA${bitlength}`)
    verifier.update(input)
    return verifier.verify(publicKey, signature, 'base64')
  }

}

/**
 * Export
 */
module.exports = RSASSA_PKCS1_v1_5
