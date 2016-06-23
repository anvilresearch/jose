'use strict'

/**
 * Dependencies
 */

/**
 * KeyChain
 *
 * @class
 * Instances of KeyChain act as a container for a set of keys. The keys can be
 * organized in an arbitrary manner to reflect the requirements of the dependent
 * application. Each "leaf" object in the instance is an instance of either the
 * KeyPair or SymmetricKey class.
 *
 * The entire instance of KeyChain is suitable to be serialized and stored in a
 * file or database. Private keys are serialized as Encrypted JWTs using a
 * master key for the KeyChain. The constructor can deserialize if provided with
 * serialized input.
 *
 * An entire KeyChain can be generated from an abbreviated descriptive object.
 * The public keys can be represented as a JWK Set. The class also manages key
 * rotation.
 */
class KeyChain {

  /**
   * Generate
   */
  static generate (descriptor) {}

  /**
   * Constructor
   */
  constructor (data) {}

  /**
   * Validate
   */
  validate () {}

  /**
   * To JWK Set
   */
  toJWKSet () {}

  /**
   * Rotate
   */
  rotate () {}

  /**
   * Serialize
   */
  static serialize () {}

  /**
   * Deserialize
   */
  static deserialize () {}
}

/**
 * Export
 */
module.exports = KeyChain
