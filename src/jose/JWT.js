/**
 * Dependencies
 */
const {JSONDocument} = require('json-document')
const JWTSchema = require('../schemas/JWTSchema')
const JWS = require('./JWS')

/**
 * JWT
 */
class JWT extends JSONDocument {

  /**
   * schema
   */
  static get schema () {
    return JWTSchema
  }

  /**
   * decode
   *
   * @description
   * Decode a JSON Web Token
   *
   * @param {string} token
   * @param {CryptoKey} key
   *
   * @returns {Promise}
   */
  static decode (token, key) {
    try {
      let components = JWT.extractComponents(token)
      let header = JSON.parse(base64url.decode(components[0]))

      let algorithm = header.alg

      if (algorithm !== 'none') {
        return Promise.reject(new InvalidAlgorithmError())
      }

      let payload = JSON.parse(base64url.decode(components[0]))
      let signature = components[2]

      let extendedJWT = this
      return new extendedJWT(header, payload, signature)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * encode
   *
   * @description
   * Encode a JSON Web Token
   *
   * @param {Object} header
   * @param {Object} payload
   * @param {CryptoKey} key
   *
   * @returns {Promise}
   */
  static encode (header, payload, key) {
    let jwt = new JWT(header, payload)
    return jwt.encode(key)
  }

  /**
   * extractComponents
   *
   * @description
   * Extract JWT components
   */
  static extractComponents (token) {
    let segments = token.split('.')
    let length = segments.length

    if (length !== 3 && length !== 5) {
      throw new Error('Malformed JWT')
    }

    return segments
  }

  /**
   * header
   *
   * @description
   * Inspect a JSON Web Token header
   *
   * @param {string} token
   * @returns {Object}
   */
  static header (token) {
    return JSON.parse(base64url.decode(this.extractComponents(token)[0]))
  }

  /**
   * payload
   *
   * @description
   * Inspect a JSON Web Token payload
   *
   * @param {string} token
   * @returns {Object}
   */
  static payload (token) {
    return JSON.parse(base64url.decode(this.extractComponents(token)[1]))
  }

  /**
   * isJWE
   */
  isJWE () {
    return !!this.header.enc
  }

  /**
   * encode
   *
   * @description
   * Encode a JWT instance
   *
   * @returns {Promise}
   */
  encode () {
    // validate
    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    let token = this

    if (this.isJWE()) {
      return JWE.encrypt(token)
    } else {
      return JWS.sign(token)
    }
  }
}

/**
 * Export
 */
module.exports = JWT
