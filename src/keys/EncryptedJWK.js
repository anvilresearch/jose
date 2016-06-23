'use strict'

/**
 * Dependencies
 */
const JWK = require('./JWK')

/**
 * EncryptedJWK
 *
 * @class
 * Adds methods suitable for serializing and deserializing a private key JWK.
 */
class EncryptedJWK extends JWK {

  /**
   * Serialize
   */
  toJWE () {}

  /**
   * Deserialize
   */
  static fromJWE () {}
}

/**
 * Export
 */
module.exports = EncryptedJWK
