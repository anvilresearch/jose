/**
 * Dependencies
 */
const base64url = require('base64url')
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
   * @param {string} data
   * @returns {JWT}
   */
  static decode (data) {
    let ExtendedJWT = this
    let jwt

    if (typeof data !== 'string') {
      throw new DataError()
    }

    // JSON of Flattened JSON Serialization
    if (data.startsWith('{')) {
      try {
        data = JSON.parse(data, () => {})
      } catch (error) {
        throw new DataError('Invalid JWT serialization')
      }

      if (data.signatures || data.recipients) {
        data.serialization = 'json'
      } else {
        data.serialization = 'flattened'
      }

      jwt = new ExtendedJWT(data)

    // Compact Serialization
    } else {
      try {
        let serialization = 'compact'
        let segments = data.split('.')
        let length = segments.length

        if (length !== 3 && length !== 5) {
          throw new Error('Malformed JWT')
        }

        let header = JSON.parse(base64url.decode(segments[0]))

        // JSON Web Signature
        if (length === 3) {
          let type = 'JWS'
          let payload = JSON.parse(base64url.decode(segments[1]))
          let signature = segments[2]

          jwt = new ExtendedJWT({type, header, payload, signature, serialization})
        }

        // JSON Web Encryption
        if (length === 5) {
          //let type = 'JWE'
          //let [protected, encryption_key, iv, ciphertext, tag] = segments

          //jwt = new ExtendedJWT({
          //  type,
          //  protected: base64url.decode(JSON.parse(protected)),
          //  encryption_key,
          //  iv,
          //  ciphertext,
          //  tag,
          //  serialization
          //})
        }
      } catch (error) {
        throw new DataError('Invalid JWT compact serialization')
      }
    }

    return jwt
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
   * verify
   *
   * @description
   *
   * @param {CryptoKey} key
   * @param {string} token
   *
   * @returns {Promise}
   */
  static verify (key, token) {
    let jwt = JWT.decode(token)
    return jwt.verify(key)
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

  /**
   * verify
   *
   * @description
   * Verify a decoded JWT instance
   *
   * @returns {Promise}
   */
  verify (keys, finder) {
    this.key = keys

    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    return JWS.verify(this)
  }
}

/**
 * Export
 */
module.exports = JWT
