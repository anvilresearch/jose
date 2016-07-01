'use strict'

/**
 * Dependencies
 * @ignore
 */
const pj = require('pem-jwk')

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
}

/**
 * Export
 */
module.exports = PEM
