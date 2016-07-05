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
   *
   * @description
   * Iterates recursively over the nested object members of its argument,
   * generating cryptographic keys for each well-formed leaf node value. The
   * returned promise resolves to an instance of KeyChain containing the newly
   * generated keys, organized accordingly.
   *
   * @example
   * KeyChain.generate({
   *   token: {
   *     sig: 'RSAKeyPair',
   *     enc: 'RSAKeyPair'
   *   },
   *   idtoken: {
   *     sig: 'RSAKeyPair'
   *   },
   *   userinfo: {
   *     enc: 'RSAKeyPair'
   *   }
   * })
   * .then(keys => {...})
   *
   * // =>
   * KeyChain {
   *   token: { sig: RSAKeyPair {...}, enc: RSAKeyPair {...} },
   *   idtoken { sig: RSAKeyPair {...} },
   *   userinfo { enc: RSAKeyPair {...} }
   * }
   *
   * @param {Object} descriptor
   * @returns {Promise}
   */
  static generate (descriptor, options = {}) {

    // Asyncronously recurse over nested descriptor properties
    return Promise.all(
      Object.keys(descriptor).map(key => {
        let value = descriptor[key]

        // Expand arrays into objects and recurse
        if (Array.isArray(value)) {
          return Promise.all(
            value.map(item => {
              return KeyChain.generateKey(options.type, options)
            })
          )
          .then(results => {
            let o = {}
            results.forEach((result, index) => {
              o[value[index]] = result
            })
            descriptor[key] = o
          })
          // TODO: expand shorthand

        // Recurse over the nested object
        } else if (typeof value === 'object') {
          return KeyChain.generate(value, options)

        // Strings represent abbreviated key generation method names
        } else if (typeof value === 'string') {
          return KeyChain.generateKey(value, options).then(result => {
            descriptor[key] = result
          })

        // Bad Descriptor Value
        } else {
          throw new Error(`Invalid value in KeyChain descriptor: ${value}`)
        }
      })
    )
    .then(results => {
      // Once the entire keychain has been generated,
      // resolve the promise returned by `KeyChain.generate()`
      // with the mutated descriptor
      return Promise.resolve(new KeyChain(descriptor))
      // TODO^ cast descriptor to KeyChain
    })
  }

  /**
   * GenerateKey
   *
   * @description
   * Dispatches to other static key(pair) generation methods by type
   * and handles error resulting from an unsupported type.
   */
  static generateKey (type, options) {
    let method = `generate${type}`

    // Return a promise, replacing the descriptor value
    // with the newly generated cryptographic key
    try {
      return KeyChain[method](options)

    // Handle an invalid value
    } catch (e) {
      return Promise.reject(
        new Error(
          `${type} is not a valid generation method`
        )
      )
    }
  }

  /**
   * Generate RSA KeyPair
   */
  static generateRSAKeyPair (options) {
    return RSAKeyPair.generate(options)
  }

  /**
   * Generate EC KeyPair
   */
  static generateECKeyPair () {
    return ECKeyPair.generate()
  }

  /**
   * TODO
   * Generate Symmetric Key
   */

  /**
   * Constructor
   */
  constructor (data) {
    Object.assign(this, data)
    //KeyChain.initialize(this)
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
