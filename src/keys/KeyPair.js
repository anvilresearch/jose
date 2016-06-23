'use strict'

/**
 * Dependencies
 */

/**
 * KeyPair
 */
class KeyPair {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {
        pub: { type: 'object' },
        prv: { type: 'object' }
      }
    }
  }

  /**
   * Generate
   */
  static generate () {
    throw new Error('KeyPair generate method must be implemented by extending class')
  }
}

/**
 * Export
 */
module.exports = KeyPair
