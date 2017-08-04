/**
 * Dependencies
 *
 * TODO
 * - switch between Node.js webcrypto package and browser implementation
 */
const base64url = require('base64url')
const supportedAlgorithms = require('../algorithms')
const {NotSupportedError} = require('../errors')

/**
 * JWA
 * https://tools.ietf.org/html/rfc7518
 */
class JWA {

  /**
   * Sign
   *
   * @description
   * Create a digital signature.
   *
   * @param {string} alg
   * @param {CryptoKey} key
   * @param {string|Buffer} data
   *
   * @return {Promise}
   */
  static sign (alg, key, data) {
    // normalize the algorithm
    let normalizedAlgorithm = supportedAlgorithms.normalize('sign', alg)

    // validate algorithm is supported
    if (normalizedAlgorithm instanceof Error) {
      return Promise.reject(new NotSupportedError(alg))
    }

    // validate type of key
    // TODO
    //  - is the key suitable for the algorithm?
    //  - does that get validated in webcrypto?
    //if (key instanceof CryptoKey) {
    //  return Promise.reject(new InvalidKeyError())
    //}

    // sign the data
    return normalizedAlgorithm.sign(key, data)
  }

  /**
   * Verify
   *
   * @description
   * Verify a digital signature.
   *
   * @param {string} alg
   * @param {CryptoKey} privateKey
   * @param {string|Buffer} signature
   * @param {string|Buffer} data
   *
   * @return {Promise}
   */
  static verify (alg, key, signature, data) {
    let normalizedAlgorithm = supportedAlgorithms.normalize('verify', alg)

    if (normalizedAlgorithm instanceof Error) {
      return Promise.reject(new NotSupportedError(alg))
    }

    // TODO
    // validate publicKey

    // verify the signature
    return normalizedAlgorithm.verify(key, signature, data)
  }

  /**
   * Encrypt
   */
  static encrypt (alg, key, data) {
    let normalizedAlgorithm = supportedAlgorithms.normalize('encrypt', alg)

    if (normalizedAlgorithm instanceof Error) {
      return Promise.reject(new NotSupportedError(alg))
    }
    // validate key ?
    return normalizedAlgorithm.encrypt(key, data)
  }

  /**
   * Decrypt
   */
  static decrypt (alg, key, data, iv, tag) {
    let normalizedAlgorithm = supportedAlgorithms.normalize('decrypt', alg)

    if (normalizedAlgorithm instanceof Error) {
      return Promise.reject(new NotSupportedError(alg))
    }
    // validate key ?
    return normalizedAlgorithm.decrypt(key, data, iv, tag)
  }

  /**
   * Import
   */
  static importKey (key) {
    let normalizedAlgorithm = supportedAlgorithms.normalize('importKey', key.alg)
    return normalizedAlgorithm.importKey(key)
  }
}

/**
 * Export
 */
module.exports = JWA
