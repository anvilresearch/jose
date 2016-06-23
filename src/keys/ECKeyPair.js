'use strict'

/**
 * Dependencies
 */
const KeyPair = require('./KeyPair')

/**
 * ECKeyPair
 */
class ECKeyPair extends KeyPair {

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
module.exports = ECKeyPair
