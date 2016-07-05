'use strict'

/**
 * Dependencies
 */

/**
 * KeyPair
 *
 * @class
 * KeyPair is a base class extended by RSAKeyPair and ECKeyPair. It defines
 * properties for holding PEM and JWK representations of asymmetric key pairs.
 */
class KeyPair {

  /**
   * Schema
   *
   * @description
   * Defines containers for PEM and JWK representations of an asymmetric keypair.
   */
  static get schema () {
    return {
      type: 'object',
      properties: {

        type: {
          type: 'string',
          enum: ['RSA', 'EC']
        },

        pub: {
          type: 'object'
        },

        prv: {
          type: 'object'
        }
      }
    }
  }

  /**
   * Generate
   *
   * @description
   * Create an asymmetric cryptographic key pair and return a new instance.
   *
   * @returns {Promise}
   * @abstract
   */
  static generate () {
    throw new Error(
      'KeyPair generate method must be implemented by extending class'
    )
  }

  /**
   * Constructor
   */
  constructor (data) {
    Object.assign(this, data)
  }
}

/**
 * Export
 */
module.exports = KeyPair
