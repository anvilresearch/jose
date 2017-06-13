'use strict'

/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const crypto = require('@trust/webcrypto')
const TextEncoder = require('../text-encoder')

/**
 * ECDSA
 */
class ECDSA {

  /**
   * constructor
   *
   * @param {string} bitlength
   */
  constructor (params) {
    this.params = params
  }

  /**
   * sign
   *
   * @description
   * Generate a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */
  sign (key, data) {
    let algorithm = this.params

    data = new TextEncoder().encode(data)

    return crypto.subtle
      .sign(algorithm, key, data)
      .then(signature => base64url(Buffer.from(signature)))
  }

  /**
   * verify
   *
   * @description
   * Verify a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} signature
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */
  verify (key, signature, data) {
    let algorithm = this.params

    if (typeof signature === 'string') {
      signature = Uint8Array.from(base64url.toBuffer(signature))
    }

    if (typeof data === 'string') {
      data = new TextEncoder().encode(data)
    }
    // ...

    return crypto.subtle.verify(algorithm, key, signature, data)
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
    let usages = key['key_ops'] || []

    if (key.use === 'sig') {
      usages.push('verify')
    }

    if (key.use === 'enc') {
      // TODO: handle encryption keys
      return Promise.resolve(key)
    }

    if (key.key_ops) {
      usages = key.key_ops
    }

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
module.exports = ECDSA
