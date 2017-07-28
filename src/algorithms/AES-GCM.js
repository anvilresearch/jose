'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('@trust/webcrypto')
const TextEncoder = require('../text-encoder')

/**
 * AES-GCM
 */
class AES_GCM {

  /**
   * constructor
   *
   * @param {string} bitlength
   */
  constructor (params) {
    this.params = params
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
    // ensure each encryption has a new iv
    this.params.iv = crypto.getRandomValues(new Uint8Array(16))
    let algorithm = this.params

    data = new TextEncoder().encode(data)

    return crypto.subtle
      .encrypt(algorithm, key, data)
      .then(ciphertext => {
        return {
          iv: base64url(Buffer.from(algorithm.iv)),
          ciphertext: base64url(Buffer.from(ciphertext))
        }
      })
  }

  /**
   * decrypt
   *
   * @description
   * .
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   * @param {BufferSource} iv
   *
   * @returns {Promise}
   */
  decrypt (key, data, iv) {
    let algorithm = this.params
    algorithm.iv = Uint8Array.from(base64url.toBuffer(iv))

    data = base64url.toBuffer(data)

    return crypto.subtle
      .decrypt(algorithm, key, data)
      .then(plaintext => Buffer.from(plaintext).toString())
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
    // usages are specified by the key_ops field ONLY in this case
    // empty usages breaks the api
    let usages = key['key_ops'] || ['encrypt', 'decrypt']

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
module.exports = AES_GCM
