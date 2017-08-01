'use strict'
/**
 * Dependencies
 */
const NotSupportedError = require('../errors/NotSupportedError')

/**
 * SupportedAlgorithms
 */
class KeyManagement {

  /**
   * constructor
   */
  constructor () {
    // Entries for key algorithms used to decide on
    // cek and compute the encrypted key
    this.keyAlgorithms = new Map([
      ['dir', { mode: this.directEncryption }]
    ])
  }

  directEncryption (key) {
    return {
      cek: key,
      encrypted_key: new Uint8Array()
    }
  }

  /**
   * normalize
   *
   * @description
   * Call the corresponding method for the
   * algorithm type based on JWA alg name
   *
   * @param {Object} alg
   * @param {Object} key
   *
   * @returns {Object}
   */
  normalize (alg, key) {
    if (!this.keyAlgorithms.get(alg)) {
      throw new NotSupportedError("Key Algorithm is not supported")
    }
    return (this.keyAlgorithms.get(alg).mode)(key)
  }
}

/**
 * Export
 */
module.exports = KeyManagement
