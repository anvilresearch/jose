'use strict'
/**
 * Dependencies
 */
const crypto = require('@trust/webcrypto')
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

  directEncryption (alg, key) {
    return {
      cek: key,
      encrypted_key: new Uint8Array()
    }
  }

  keyWrapOrEncrypt (alg, key) {
    let cek = new Uint8Array(this.keyAlgorithms.get(alg).cekLength)
    cek = crypto.getRandomValues(cek)
    let encrypted_key = JWA.encrypt(alg, key, cek)
    return {
      cek,
      encrypted_key
    }
  }

  keyAgreeAndWrap (alg, key) {
    let cek = new Uint8Array(this.keyAlgorithms.get(alg).cekLength)
    cek = crypto.getRandomValues(cek)
    // use alg to agree on the key
    let agreedKey
    // probably this is not encrypt, but wrap
    // the spec is confusing
    let encrypted_key = JWA.encrypt(alg, agreedKey, cek)
    return {
      cek,
      encrypted_key
    }
  }

  directAgree (alg, key) {
    let agreedKey
    let cek = agreedKey
    return {
      cek,
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
    return (this.keyAlgorithms.get(alg).mode)(alg, key)
  }
}

/**
 * Export
 */
module.exports = KeyManagement
