/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('json-document')
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
   * @param {String} data
   *
   * @returns {Promise<JWT>}
   */
  static decode (data) {
    let ExtendedJWT = this
    let token

    if (typeof data !== 'string') {
      return Promise.reject(new DataError('JWT must be a string'))
    }

    // JSON of Flattened JSON Serialization
    if (data.startsWith('{')) {
      try {
        data = JSON.parse(data)
      } catch (error) {
        return Promise.reject(new DataError('Invalid JWT serialization'))
      }

      let { protected: protectedHeader, header: unprotectedHeader, payload, signature, signatures, recipients } = data
      let decodedPayload = JSON.parse(base64url.decode(payload))

      // General JSON Serialization
      if (signatures || recipients) {
        // TODO recipients

        let decodedSignatures = signatures.map(descriptor => {
          let { protected: protectedHeader, header: unprotectedHeader, signature } = descriptor
          let decodedHeader = JSON.parse(base64url.decode(protectedHeader))

          return {
            protected: decodedHeader,
            header: unprotectedHeader,
            signature
          }
        })

        token = new ExtendedJWT({
          payload: decodedPayload,
          signatures: decodedSignatures
        })

        Object.defineProperty(token, 'serialization', { value: 'json', enumerable: false })
        Object.defineProperty(token, 'type', { value: 'JWS', enumerable: false })

      // Flattened JSON Serialization
      } else {
        let decodedHeader = JSON.parse(base64url.decode(protectedHeader))

        token = new ExtendedJWT({
          protected: decodedHeader,
          payload: decodedPayload,
          header: unprotectedHeader,
          signature
        })

        Object.defineProperty(token, 'serialization', { value: 'flattened', enumerable: false })
        Object.defineProperty(token, 'type', { value: 'JWS', enumerable: false })
      }

    // Compact Serialization
    } else {
      try {
        let serialization = 'compact'
        let segments = data.split('.')
        let length = segments.length

        if (length !== 3 && length !== 5) {
          return Promise.reject(new DataError('Malformed JWT'))
        }

        let decodedHeader = JSON.parse(base64url.decode(segments[0]))

        // JSON Web Signature
        if (length === 3) {
          let type = 'JWS'
          let decodedPayload = JSON.parse(base64url.decode(segments[1]))
          let signature = segments[2]

          token = new ExtendedJWT({ header: decodedHeader, payload: decodedPayload, signature })
          Object.defineProperty(token, 'serialization', { value: serialization, enumerable: false })
          Object.defineProperty(token, 'type', { value: type, enumerable: false })
          Object.defineProperty(token, 'segments', { value: segments, enumerable: false })
        }

        // JSON Web Encryption
        if (length === 5) {
          // TODO
          // let type = 'JWE'
          // let [protected: protectedHeader, encryption_key, iv, ciphertext, tag] = segments
          // let decodedHeader = base64url.decode(JSON.parse(protected))

          // token = new ExtendedJWT({
          //  protected: decodedHeader,
          //  encryption_key,
          //  iv,
          //  ciphertext,
          //  tag,
          // })
          // Object.defineProperty(token, 'serialization', { value: serialization, enumerable: false })
          // Object.defineProperty(token, 'type', { value: type, enumerable: false })
          // Object.defineProperty(token, 'segments', { value: segments, enumerable: false })
        }
      } catch (error) {
        return Promise.reject(new DataError('Invalid JWT compact serialization'))
      }
    }

    return Promise.resolve(token)
  }

  /**
   * encode
   *
   * @description
   * Encode a JSON Web Token
   *
   * @param {CryptoKey|Object} key
   * @param {CryptoKey} key.sign
   * @param {CryptoKey} key.encrypt
   * @param {Object} data
   * @param {Object} [options]
   *
   * @returns {Promise<SerializedToken>}
   */
  static encode (key, data, options={}) {
    let ExtendedJWT = this
    let token = new ExtendedJWT(data)

    if (!key) {
      return Promise.reject(new DataError('Key required to encode JWT'))
    }

    if (key.encrypt) {
      // TODO JSON Web Encryption
      // Object.defineProperty(descriptor, 'encryption_key', {
      //   value: key.encrypt,
      //   enumerable: false
      // })
    }

    // Assign options to JWT as nonenumerable properties
    Object.keys(options).forEach(field => {
      Object.defineProperty(token, field, { value: options[field], enumerable: false })
    })

    // Multiple Signatures/Keys
    if (token.signatures) {
      let { signatures } = token

      // Assign key to new signature
      token.signatures = signatures.map(descriptor => {

        if (!descriptor.signature) {
          Object.defineProperty(descriptor, 'key', { value: key.sign ? key.sign : key, enumerable: false })
        }

        return descriptor
      })

    // Single Signature/Key
    } else {
      Object.defineProperty(token, 'key', { value: key.sign ? key.sign : key, enumerable: false })
    }

    return token.encode()
  }


  /**
   * verify
   *
   * @description
   * Decode and verify a JSON Web Token
   *
   * @param {CryptoKey|Array<CryptoKey>} key
   * @param {String} data
   * @param {Object} [options]
   *
   * @returns {Promise<JWT>}
   */
  static verify (key, data, options={}) {
    let ExtendedJWT = this
    let jwt

    // Decode
    return ExtendedJWT.decode(data).then(token => {
      let { signatures } = token
      jwt = token

      // Assign options to JWT as nonenumerable properties
      Object.keys(options).forEach(field => {
        Object.defineProperty(token, field, { value: options[field], enumerable: false })
      })

      // Map keys to signatures by index
      if (Array.isArray(key) && signatures) {
        token.signatures = signatures.map((descriptor, index) => {
          // TODO more sophisticated key mapping using hints like `kid'
          if (index < key.length) {
            Object.defineProperty(descriptor, 'key', { value: key[index], enumerable: false })
          }

          return descriptor
        })

      // Assign single key to all signatures as nonenumerable property
      } else if (signatures) {
        token.signatures = signatures.map(descriptor => {
          Object.defineProperty(descriptor, 'key', { value: key, enumerable: false })
          return descriptor
        })

      // Assign key to token as nonenumerable property
      } else {
        Object.defineProperty(token, 'key', { value: key, enumerable: false })
      }

      return token.verify()
    }).then(verified => jwt)
  }

  /**
   * isJWE
   */
  isJWE () {
    let { header: unprotectedHeader, protected: protectedHeader } = this
    return !!((unprotectedHeader && unprotectedHeader.enc)
      || (protectedHeader && protectedHeader.enc))
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
      console.log(match)
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
   * Encode a JSON Web Token instance
   *
   * @returns {Promise<SerializedToken>}
   */
  encode () {
    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    if (this.isJWE()) {
      return JWE.encrypt(this)
    } else {
      return JWS.sign(this)
    }
  }

  /**
   * verify
   *
   * @description
   * Verify a decoded JSON Web Token instance
   *
   * @returns {Promise<Boolean>}
   */
  verify () {
    return JWS.verify(this)
  }
}

/**
 * Export
 */
module.exports = JWT
