'use strict'

/**
 * Dependencies
 */
const JWK = require('./JWK')

/**
 * ECPublicKey
 */
class ECPublicKey extends JWK {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {
        crv: {},
        x: {},
        y: {}
      }
    }
  }
}

/**
 * Export
 */
module.exports = ECPublicKey
