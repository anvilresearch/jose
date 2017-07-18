'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('@trust/webcrypto')
const TextEncoder = require('../text-encoder')

/**
 * AES-CBC
 */
class AES_CBC {

  /**
   * constructor
   *
   * @param {string} bitlength
   */
  constructor (params) {
    this.params = params
    this.params.iv = crypto.getRandomValues(new Uint8Array(16))
  }

  /**
   * encrypt
   *
   * @description
   * .
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */
  encrypt (key, data) {
    let algorithm = this.params
    data = new TextEncoder().encode(data)

    return crypto.subtle
      .encrypt(algorithm, key, data)
      .then(ciphertext => base64url(Buffer.from(ciphertext)))
  }

}
/**
 * Export
 */
module.exports = AES_CBC
