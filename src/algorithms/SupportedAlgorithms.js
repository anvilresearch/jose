/**
 * Dependencies
 */
const NotSupportedError = require('../errors/NotSupportedError')

/**
 * Operations
 */
const operations = [
  'sign',
  'verify',
  'encrypt',
  'decrypt',
  'importKey'
]

/**
 * SupportedAlgorithms
 */
class SupportedAlgorithms {

  /**
   * constructor
   */
  constructor () {
    operations.forEach(op => {
      this[op] = {}
    })
  }

  /**
   * Supported Operations
   */
  static get operations () {
    return operations
  }

  /**
   * define
   *
   * @description
   * Register Web Crypto API algorithm parameter for an algorithm
   * and operation.
   *
   * @param {string} alg
   * @param {string} op
   * @param {Object} argument
   */
  define (alg, op, argument) {
    let registeredAlgorithms = this[op]
    registeredAlgorithms[alg] = argument
  }

  /**
   * normalize
   *
   * @description
   * Map JWA alg name to Web Crypto API algorithm parameter
   *
   * @param {string} op
   * @param {Object} alg
   *
   * @returns {Object}
   */
  normalize (op, alg) {
    let registeredAlgorithms = this[op]

    if (!registeredAlgorithms) {
      return new SyntaxError() // what kind of error should this be?
    }

    let argument = registeredAlgorithms[alg]

    if (!argument) {
      return new NotSupportedError(alg)
    }

    return argument
  }
}

/**
 * Export
 */
module.exports = SupportedAlgorithms
