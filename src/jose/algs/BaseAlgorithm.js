'use strict'

/**
 * Dependencies
 * @ignore
 */

/**
 * PEM Regular Expression
 */
const PEM = /^-----BEGIN (.+) (PRIVATE|PUBLIC) KEY-----[\s\S]*-----END \1 (PRIVATE|PUBLIC) KEY-----/

/**
 * BaseAlgorithm
 */
class BaseAlgorithm {

  /**
   * Constructor
   */
  constructor () {}

  /**
   * Sign
   */
  sign () {
    let { constructor: {name} } = this
    throw new Error(`Sign is not a supported operation for ${name}`)
  }

  /**
   * Verify
   */
  verify () {
    let { constructor: {name} } = this
    throw new Error(`Verify is not a supported operation for ${name}`)
  }

  /**
   * Encrypt
   */
  encrypt () {
    let { constructor: {name} } = this
    throw new Error(`Encrypt is not a supported operation for ${name}`)
  }

  /**
   *Decrypt
   */
  decrypt () {
    let { constructor: {name} } = this
    throw new Error(`Decrypt is not a supported operation for ${name}`)
  }

  /**
   * isPEM
   */
  static isPEM (key) {
    return (
      typeof key === 'string' &&
      key.match(PEM)
    )
  }

  /**
   * JWK to PEM
   */
  static toPEM (key) {
    if (this.isPEM(key)) {
      return key
    }

    try {
      return key.toPEM()
    } catch (e) {
      throw new Error('This algorithm does not support PEM')
    }
  }
}


