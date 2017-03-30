/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('json-document')
const JWTSchema = require('../schemas/JWTSchema')
const JWS = require('./JWS')
const DataError = require('../errors/DataError')

/**
 * Regular Expressions
 */
const BASE64_REGEX = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

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
   * @param {String|Object} data
   * @param {String} data.serialized - The serialized token string
   *
   * @returns {JWT}
   */
  static decode (data) {
    let ExtendedJWT = this
    let serialized, params = {}

    /**
     * Input Validation
     */

    // Object input
    if (typeof data === 'object' && !Array.isArray(data)) {
      params = data
      serialized = data.serialized

    // String input
    } else if (typeof data === 'string') {
      serialized = data

    // Other input
    } else {
      throw new DataError('data must be a string or an object')
    }

    // Serialized JWT input must be a string
    if (serialized && typeof serialized !== 'string') {
      throw new DataError('JWT must be a string')
    }

    /**
     * Deserialize
     *
     * This infers serialization and builds up the `params' object. All JWTs are stored (in memory)
     * in the document format, even if a single signature format (such as compact) is provided.
     *
     * i.e.
     *
     * let params = {
     *   payload,
     *   signatures: [
     *     {
     *       header: unprotectedHeader,
     *       protected: protectedHeader,
     *       signature
     *     }
     *   ]
     * }
     */

    // JSON or Flattened JSON Serialization
    if (serialized && serialized.startsWith('{')) {
      try {
        data = JSON.parse(serialized)
      } catch (error) {
        throw new DataError('Invalid JWT serialization')
      }

      let { protected: protectedHeader, header: unprotectedHeader, payload, signature, signatures, recipients, cryptoKey } = data

      // General JSON Serialization or Document Serialization
      if (signatures || recipients) {
        // TODO Encryption

        // General JSON Serialization
        if (base64url.toBase64(payload).match(BASE64_REGEX)) {
          if (!params.serialization) {
            params.serialization = 'json'
          }

          let decodedPayload = JSON.parse(base64url.decode(payload))

          params.payload = decodedPayload
          let transformedSignatures = signatures.map(descriptor => {
            let { protected: protectedHeader, header: unprotectedHeader, signature, cryptoKey } = descriptor
            let decodedHeader = JSON.parse(base64url.decode(protectedHeader))

            return {
              protected: decodedHeader,
              header: unprotectedHeader,
              signature,
              cryptoKey
            }
          })

          if (Array.isArray(params.signatures)) {
            params.signatures.unshift(transformedSignatures)
          } else {
            params.signatures = transformedSignatures
          }

        // Document Serialization
        } else {
          if (!params.serialization) {
            params.serialization = 'document'
          }

          params.payload = payload
          let transformedSignatures = signatures.map(descriptor => {
            let { protected: protectedHeader, header: unprotectedHeader, signature, cryptoKey } = descriptor

            return {
              protected: protectedHeader,
              header: unprotectedHeader,
              signature,
              cryptoKey
            }
          })

          if (Array.isArray(params.signatures)) {
            params.signatures.unshift(transformedSignatures)
          } else {
            params.signatures = transformedSignatures
          }
        }

      // Flattened JSON or Flattened Document Serialization
      } else {

        // Flattened JSON Serialization
        if (base64url.toBase64(payload).match(BASE64_REGEX)) {
          let decodedPayload = JSON.parse(base64url.decode(payload))
          let decodedHeader = JSON.parse(base64url.decode(protectedHeader))

          if (!params.serialization) {
            params.serialization = 'flattened'
          }

          params.payload = decodedPayload
          let transformedSignatures = {
            protected: decodedHeader,
            header: unprotectedHeader,
            signature,
            cryptoKey
          }

          if (Array.isArray(params.signatures)) {
            params.signatures.unshift(transformedSignatures)
          } else {
            params.signatures = [transformedSignatures]
          }

        // Flattened Document Serialization
        } else {
          if (!params.serialization) {
            params.serialization = 'flattened-document'
          }

          params.payload = payload
          let transformedSignatures = {
            protected: protectedHeader,
            header: unprotectedHeader,
            signature,
            cryptoKey
          }

          if (Array.isArray(params.signatures)) {
            params.signatures.unshift(transformedSignatures)
          } else {
            params.signatures = [transformedSignatures]
          }
        }
      }

    // Compact Serialization
    } else if (serialized) {
      try {
        let serialization = 'compact'
        let segments = serialized.split('.')
        let length = segments.length

        if (length !== 3 && length !== 5) {
          throw new DataError('Malformed JWT')
        }

        if (!params.serialization) {
          params.serialization = 'compact'
        }

        let decodedHeader = JSON.parse(base64url.decode(segments[0]))

        // JSON Web Signature
        if (length === 3) {
          let decodedPayload = JSON.parse(base64url.decode(segments[1]))
          let signature = segments[2]

          params.segments = segments
          params.payload = decodedPayload
          params.signatures = [
            {
              protected: decodedHeader,
              signature
            }
          ]

          if (Array.isArray(params.signatures)) {
            params.signatures.unshift(transformedSignatures)
          } else {
            params.signatures = [transformedSignatures]
          }

        }

        // JSON Web Encryption
        if (length === 5) {
          // TODO from previous iteration

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
        }
      } catch (error) {
        throw new DataError('Invalid JWT compact serialization')
      }
    }

    return new ExtendedJWT(params)
  }

  /**
   * sign
   *
   * @description
   * Sign a JSON Web Token
   *
   * @params {...Object} data - Token data
   *
   * @returns {Promise<SerializedToken>}
   */
  static sign (...data) {
    // Shallow merge data
    let params = Object.assign(...data)

    let ExtendedJWT = this
    let token = ExtendedJWT.decode(params)

    return token.sign(token)
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

    // Default to compact serialization or json serialization (multiple signatures)
    if (!token.serialization) {
      if (token.signatures) {
        Object.defineProperty(token, 'serialization', { value: 'json', enumerable: false })
      } else {
        Object.defineProperty(token, 'serialization', { value: 'compact', enumerable: false })
      }
    }

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
    let token

    try {
      token = ExtendedJWT.decode(data)
    } catch (err) {
      return Promise.reject(err)
    }

    let { signatures } = token

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

    return token.verify().then(verified => token)
  }

  /**
   * constructor
   */
  constructor (data, options) {
    // Normalize input to JWD format
    let descriptor = Object.assign({}, data)
    let serialization
    let { protected: protectedHeader, header: unprotectedHeader, signature, signatures, cryptoKey, segments } = descriptor

    // JSON Document Hack (this should be removed once JSON Document is fixed)
    delete descriptor.protected
    delete descriptor.header
    delete descriptor.signature
    delete descriptor.cryptoKey
    delete descriptor.segments

    // Flat signature input
    let signatureDescriptor

    // Compact
    if (!protectedHeader && unprotectedHeader) {
      signatureDescriptor = {
        protected: unprotectedHeader
      }

    // Other
    } else if (protectedHeader) {
      signatureDescriptor = {
        protected: protectedHeader
      }
    }

    if (signatureDescriptor) {
      // Signature present
      if (signature) {
        signatureDescriptor.signature = signature
      }

      // Key present
      if (cryptoKey) {
        signatureDescriptor.cryptoKey = cryptoKey
      }

      // Move flat signature into the front of the signatures array
      if (signatures && Array.isArray(signatures)) {
        descriptor.signatures.unshift(signatureDescriptor)
      } else {
        descriptor.signatures = [signatureDescriptor]
        signatures = descriptor.signatures
      }
    }

    // Create instance
    super(descriptor, options)

    // Prioritize provided serialization over inferred serialization
    if (data.serialization) {
      serialization = data.serialization
    }

    // Handle non-enumerable properties
    // TODO Encryption. Always set JWS type in the meanwhile
    Object.defineProperty(this, 'type', { value: 'JWS', enumerable: false })

    // Serialization
    if (serialization) {
      Object.defineProperty(this, 'serialization', { value: serialization, enumerable: false })
    }

    // Segments
    if (segments) {
      Object.defineProperty(this, 'segments', { value: segments, enumerable: false })
    }

    // TODO import additional key types (pem, jwk, etc.) into cryptoKeys

    // Nested Keys (for signatures)
    if (signatures) {
      this.signatures.forEach((descriptor, index) => {
        // Get signature from input data
        let { cryptoKey: signatureKey } = signatures[index]

        // Mutate individual signature descriptor object to contain non-enumerable signature key
        if (signatureKey) {

          // JSON Document Hack (this should be removed once JSON Document is fixed)
          delete descriptor.cryptoKey

          Object.defineProperty(descriptor, 'key', { value: signatureKey, enumerable: false })
        }
      })
    }
  }

  /**
   * isJWE
   */
  isJWE () {
    let { header: unprotectedHeader, protected: protectedHeader, recipients } = this
    return !!((unprotectedHeader && unprotectedHeader.enc)
      || (protectedHeader && protectedHeader.enc)
      || recipients)
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
   * sign
   *
   * @description
   * Sign a JWT instance
   *
   * @param {...Object} data
   *
   * @returns {Promise<SerializedToken>}
   */
  sign (...data) {
    return Promise.resolve(Object.assign(...data))
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

  /**
   * toCompactJWT
   *
   * @todo This needs some error checking: i.e. no signature or more than one signature?
   */
  toCompactJWT () {
    let { payload, signatures } = this
    let [{ protected: protectedHeader, signature }] = signatures

    // Encode protected header and payload
    let encodedPayload = base64url(JSON.stringify(payload))
    let encodedHeader = base64url(JSON.stringify(protectedHeader))
    let data = `${encodedHeader}.${encodedPayload}`

    if (this.isJWE()) {
      // TODO
    } else {
      // Return compact JWT with signature
      if (signature) {
        return `${data}.${signature}`

      // Return compact JWT without signature
      } else {
        return `${data}.`
      }
    }
  }

  /**
   * toFlattenedJWT
   *
   * @todo This needs some error checking: i.e. no signature or more than one signature?
   */
  toFlattenedJWT () {
    let { payload, signatures: [{ protected: protectedHeader, header: unprotectedHeader, signature }] } = this

    // Encode protected header and payload
    let encodedPayload = base64url(JSON.stringify(payload))
    let encodedHeader = base64url(JSON.stringify(protectedHeader))

    if (this.isJWE()) {
      // TODO
    } else {
      // Return flattened JWT with signature
      if (signature) {
        return JSON.stringify({ payload: encodedPayload, header: unprotectedHeader, protected: encodedHeader })

      // Return flattened JWT without signature
      } else {
        return JSON.stringify({ payload: encodedPayload, header: unprotectedHeader, protected: encodedHeader, signature })
      }
    }
  }

  /**
   * toGeneralJWT
   */
  toGeneralJWT () {
    let { payload, signatures } = this

    // Encode payload
    let encodedPayload = base64url(JSON.stringify(payload))

    if (this.isJWE()) {
      // TODO
    } else {
      // Return with signature
      if (signatures) {

        // Serialize signatures
        let serializedSignatures = signatures.map(descriptor => {
          let { header: unprotectedHeader, protected: protectedHeader, signature } = descriptor

          // Encode protected header
          let encodedHeader = base64url(JSON.stringify(protectedHeader))

          return { header: unprotectedHeader, protected: encodedHeader, signature }
        })

        return JSON.stringify({ payload: encodedPayload, signatures: serializedSignatures })

      // Return without signatures
      } else {
        return JSON.stringify({ payload: encodedPayload })
      }
    }
  }

  /**
   * toFlattenedJWD
   *
   * @todo This needs some error checking: i.e. no signature or more than one signature?
   */
  toFlattenedJWD () {
    let { payload, signatures: [{ protected: protectedHeader, header: unprotectedHeader, signature }] } = this

    if (this.isJWE()) {
      // TODO
    } else {
      // Return flattened JWD with signature
      if (signature) {
        return JSON.stringify({ payload, header: unprotectedHeader, protected: protectedHeader })

      // Return flattened JWD without signature
      } else {
        return JSON.stringify({ payload, header: unprotectedHeader, protected: protectedHeader, signature })
      }
    }
  }

  /**
   * toJWD
   */
  toJWD () {
    if (this.isJWE()) {
      // TODO
    } else {
      return JSON.stringify(this)
    }
  }
}

/**
 * Export
 */
module.exports = JWT
