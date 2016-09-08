/**
 * Dependencies
 */
const {JSONDocument} = require('json-document')
const JWTSchema = require('../schemas/JWTSchema')

/**
 * JWT
 */
class JWT extends JSONDocument {

  /**
   * constructor
   */
  constructor (header, payload, signature) {
    super()
    this.constructor.schema.initialize(this, { header, payload })
    this.signature = signature
  }

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
   * encode
   *
   * @description
   * Encode a JWT instance
   *
   * @param {CryptoKey} key
   * @returns {Promise}
   */
  encode (key) {
    // validate
    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    let algorithm = this.header.alg

    if (algorithm !== 'none') {
      return Promise.reject(new InvalidAlgorithmError())
    }

    let header = base64url(JSON.stringify(this.header))
    let payload = base64url(JSON.stringify(this.payload))

    return Promise.resolve(`${header}.${payload}.`)
  }
}

/**
 * Export
 */
module.exports = JWT
