'use strict'
/**
 * Dependencies
 */
const crypto = require('@trust/webcrypto')
const NotSupportedError = require('./errors/NotSupportedError')
const { JWA } = require('@trust/jwa')

/**
 * KeyManagement
 */
class KeyManagement {

  /**
   * constructor
   */
  constructor () {
    // Entries for key algorithms used to decide on
    // cek and compute the encrypted key
    this.keyAlgorithms = new Map([
      ['dir', { encrypt: this.direct, decrypt: this.direct }]
    ])
  }

  direct (alg, key) {
    return {
      cek: key,
      encrypted_key: new Uint8Array()
    }
  }

  keyWrapOrEncrypt (alg, key) {
    let cek, encrypted_key
    cek = new Uint8Array(this.keyAlgorithms.get(alg).cekLength)
    cek = crypto.getRandomValues(cek)
    JWA.encryptKey(alg, cek, key)
    .then(result => {
      encrypted_key = result

      return {
        cek,
        encrypted_key
      }
    })
  }

  keyAgreeAndWrap (alg, key) {
    let cek = new Uint8Array(this.keyAlgorithms.get(alg).cekLength)
    cek = crypto.getRandomValues(cek)
    // use alg to agree on the key
    JWA.generateKey(alg)
    .then(agreedKey => {
      JWA.encryptKey(alg, cek, agreedKey)
      .then(result => {
        encrypted_key = result

        return {
          cek,
          encrypted_key
        }
      })
    })
  }

  directAgree (alg, key) {
    JWA.generateKey(alg)
    .then(agreedKey => {
      return {
        cek: agreedKey,
        encrypted_key: new Uint8Array()
      }
    })
  }

  /**
   * determineCek
   *
   * @description
   * Call the corresponding method for the algorithm type
   * based on JWA alg name
   *
   * @param {Boolean} verify
   * @param {Object} alg
   * @param {Object} key
   *
   * @returns {Promise}
   */
  determineCek (verify, alg, key) {
    if (!this.keyAlgorithms.get(alg)) {
      throw new NotSupportedError("Key Algorithm is not supported")
    }
    if (!verify) {
      return (this.keyAlgorithms.get(alg).encrypt)(alg, key)
    } else {
      return (this.keyAlgorithms.get(alg).decrypt)(alg, key)
    }
  }
}

/**
 * Export
 */
module.exports = KeyManagement
