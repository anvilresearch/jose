/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('@trust/json-document')
const JWTSchema = require('../schemas/JWTSchema')
const JWS = require('./JWS')
const DataError = require('../errors/DataError')

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
      throw new DataError('JWT must be a string')
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

      jwt = new ExtendedJWT(data, { filter: false })

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

          jwt = new ExtendedJWT(
              { type, segments, header, payload, signature, serialization },
              { filter: false }
            )
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
    jwt.key = key
    return jwt.verify().then(verified => jwt)
  }

  /**
   * isJWE
   */
  isJWE () {
    return !!this.header.enc
  }

  /**
   * resolveKeys
   */
  resolveKeys (jwks) {
    let kid = this.header.kid
    let keys, match

    // treat an array as the "keys" property of a JWK Set
    if (Array.isArray(jwks)) {
      keys = jwks
    }

    // presence of keys indicates object is a JWK Set
    if (jwks.keys) {
      keys = jwks.keys
    }

    // wrap a plain object they is not a JWK Set in Array
    if (!jwks.keys && typeof jwks === 'object') {
      keys = [jwks]
    }

    // ensure there are keys to search
    if (!keys) {
      throw new DataError('Invalid JWK argument')
    }

    // match by "kid" or "use" header
    if (kid) {
      match = keys.find(jwk => jwk.kid === kid)
    } else {
      match = keys.find(jwk => jwk.use === 'sig')
    }

    // assign matching key to JWT and return a boolean
    if (match) {
      this.key = match.cryptoKey
      return true
    } else {
      return false
    }
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
  verify () {
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
