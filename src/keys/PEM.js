'use strict'

/**
 * Dependencies
 * @ignore
 */
const pj = require('pem-jwk')
const {PEM_REGEXP} = require('../jose/formats')

/**
 * PEM
 */
class PEM {

  /**
   * From JWK
   */
  static fromJWK (jwk) {
    if (!(
      typeof jwk === 'object' &&
      !Buffer.isBuffer(jwk) &&
      !Array.isArray(jwk) &&
      !!jwk
    )) {
      let message = `${JSON.stringify(jwk)} is not a valid JWK`
      throw new Error(message)
    }

    return pj.jwk2pem(jwk)
  }

  /**
   * To JWK
   */
  static toJWK (pem) {
    if (!(
      typeof pem === 'string' &&
      pem.match(PEM_REGEXP) &&
      !Buffer.isBuffer(pem) &&
      !Array.isArray(pem) &&
      !!pem
    )) {
      let message = `${JSON.stringify(pem)} is not a valid PEM-encoded key`
      throw new Error(message)
    }
    return pj.pem2jwk(pem)
  }

  /**
   * Is PEM
   */
  static isPEM (pem, alg, type) {
    if (typeof pem !== 'string') {
      return false
    }

    let match = pem.match(PEM_REGEXP)

    if (!match) { return false }

    let algorithm = match[1]
    let asymmetric = match[2]

    if (algorithm && !algorithm.match(alg)) { return false }
    if (type && asymmetric !== type) { return false }

    return true
  }
}

/**
 * Export
 */
module.exports = PEM
