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
  encrypt (key, data, aad) {
    let algorithm = Object.assign({}, this.params)
    // ensure each encryption has a new iv
    algorithm.iv = crypto.getRandomValues(new Uint8Array(16))
    algorithm.additionalData = aad

    data = new TextEncoder().encode(data)

    return crypto.subtle
      .encrypt(algorithm, key, data)
      .then(result => {
        // split the result into ciphertext and tag
        let tagLength = (algorithm.tagLength / 8) || 16
        let tag = result.slice(result.byteLength - tagLength)
        let ciphertext = result.slice(0, -tagLength)

        return {
          iv: base64url(Buffer.from(algorithm.iv)),
          ciphertext: base64url(Buffer.from(ciphertext)),
          tag: base64url(Buffer.from(tag))
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
  decrypt (key, ciphertext, iv, tag, aad) {

    let algorithm = this.params

    algorithm.iv = Uint8Array.from(base64url.toBuffer(iv))

    algorithm.additionalData = aad

    // Decode ciphertext and tag from base64
    ciphertext = base64url.toBuffer(ciphertext)
    tag = base64url.toBuffer(tag)

    // Concatenate the two buffers
    let data = new Uint8Array(ciphertext.length + tag.length)
    data.set(new Uint8Array(ciphertext), 0)
    data.set(new Uint8Array(tag), ciphertext.length)
    data = data.buffer

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
