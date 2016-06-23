'use strict'

/**
 * Dependencies
 */
const KeyPair = require('./KeyPair')

/**
 * RSAKeyPair
 */
class RSAKeyPair extends KeyPair {

  /**
   * Generate
   */
  static generate () {
    return Promise.resolve('TBD')
  }
}

/**
 * Export
 */
module.exports = RSAKeyPair
