'use strict'

/**
 * Dependencies
 * @ignore
 */
const RSAKeyPair = require('./RSAKeyPair')
const ECKeyPair = require('./ECKeyPair')

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
  static generate (descriptor) {
    return Promise.resolve(new KeyChain(descriptor))
  }

  /**
   * Constructor
   */
  constructor (data) {
    Object.assign(this, data)
    KeyChain.initialize(this)
  }

  /**
   * Initialize
   *
   * @description
   * Traverse the keychain and cast leaf objects to a KeyPair instance dependending
   * on their type.
   *
   * @param {Object} object
   *
   * TODO
   * - test the hell out of this
   * - perhaps this should be part of deserialize?
   */
  static initialize (object) {
    Object.keys(object).forEach(key => {
      let property = object[key]

      // the property is not an object
      //  => error
      if (typeof property !== 'object') {
        throw new Error(`Can\'t initialize ${JSON.stringify(object)}`)
      }
      // the property is an object with an unsupported type
      //  => error
      if (property.type && (
        property.type !== 'RSA' &&
        property.type !== 'EC'
      )) {
        throw new Error(
          `Can\'t initialize KeyPair of unsupported type ${property.type}`
        )
      }
      // the property is an object without type
      //  => recurse
      if (typeof property === 'object' && !property.type) {
        return KeyChain.initialize(property)
      }
      // the property is an object with a supported type
      //  => cast to type and terminate the recursion
      if (property.type === 'RSA') {
        object[key] = new RSAKeyPair(property)
      }

      if (property.type === 'EC') {
        object[key] = new ECKeyPair(property)
      }
    })
  }

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
