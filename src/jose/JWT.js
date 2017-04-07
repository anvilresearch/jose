/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('json-document')
const JWTSchema = require('../schemas/JWTSchema')
const JWA = require('./JWA')
const DataError = require('../errors/DataError')

/**
 * Helper Functions
 * @ignore
 */
function clean (input) {
  return JSON.parse(JSON.stringify(input))
}

/**
 * JWT
 */
class JWT extends JSONDocument {

  /**
   * constructor
   */
  constructor (data, options) {
    super(data, options)

    Object.keys(data).forEach(key => {
      if (!this[key]) {
        Object.defineProperty(this, key, {
          value: data[key],
          enumerable: false,
          configurable: true
        })
      }
    })
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
   * @param {String|Object} token
   *
   * @returns {JWT}
   */
  static decode (token) {
    let ExtendedJWT = this

    if (typeof token === 'string') {

      // Parse
      if (token.startsWith('{')) {
        try {
          token = JSON.parse(token)
        } catch (err) {
          throw new DataError('Malformed JWT')
        }
      }

    } else if (typeof token !== 'object' || token === null || Array.isArray(token)) {
      throw new DataError('Invalid JWT')
    }

    // Compact
    if (typeof token === 'string') {
      return this.fromCompact(token)
    }

    // JSON General
    if (token.signatures) {
      return this.fromGeneral(token)

    // JSON Flattened
    } else {
      return this.fromFlattened(token)
    }
  }

  /**
   * fromCompact
   *
   * @description
   * Deserialize a Compact JWT and instantiate an instance
   *
   * @param  {String} data
   * @return {JWT}
   */
  static fromCompact (data) {
    let ExtendedJWT = this
    let protectedHeader, payload, signature

    // Parse
    if (typeof data === 'string') {
      let segments = data.split('.')

      if (![3, 5].includes(segments.length)) {
        throw new DataError('Malformed JWT')
      }

      // Decode base64url
      if (segments.length === 3) {
        try {
          protectedHeader = JSON.parse(base64url.decode(segments[0]))
          payload = JSON.parse(base64url.decode(segments[1]))
          signature = segments[2]
        } catch (err) {
          throw new DataError('Malformed JWS')
        }
      }

      if (segments.length === 5) {
        // TODO JWE
      }
    }

    // Sanity Check
    if (typeof protectedHeader !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
      throw new DataError('JWT Header must be an object')
    }

    // Normalize and return instance
    return new ExtendedJWT(
      clean({
        payload,
        signatures: [
          { protected: protectedHeader, signature }
        ],
        serialization: 'compact',
        type: 'JWS'
      })
    )
  }

  /**
   * fromFlattened
   *
   * @description
   * Deserialize a JSON Flattened JWT and instantiate an instance
   *
   * @param  {Object|String} data
   * @return {JWT}
   */
  static fromFlattened (data) {
    let ExtendedJWT = this
    let protectedHeader, unprotectedHeader, payload, signature

    // Parse
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        throw new DataError('Malformed JWT')
      }
    }

    // Input should be an object by now
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new DataError('Invalid JWT')
    }

    // Decode base64url
    try {
      payload = JSON.parse(base64url.decode(data.payload))
      protectedHeader = JSON.parse(base64url.decode(data.protected))
    } catch (err) {
      throw new Error('Invalid JWT')
    }

    // Sanity Check
    if (typeof protectedHeader !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
      throw new DataError('JWT Header must be an object')
    }

    if (unprotectedHeader && (typeof unprotectedHeader !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
      throw new DataError('JWT Header must be an object')
    }

    unprotectedHeader = data.header
    signature = data.signature

    // Normalize and return instance
    return new ExtendedJWT(
      clean({
        payload,
        signatures: [
          { protected: protectedHeader, header: unprotectedHeader, signature }
        ],
        serialization: 'flattened',
        type: 'JWS'
      })
    )
  }

  /**
   * fromGeneral
   *
   * @description
   * Deserialize a JSON General JWT and instantiate an instance
   *
   * @param  {Object|String} data
   * @return {JWT}
   */
  static fromGeneral (data) {
    let ExtendedJWT = this
    let payload, signatures

    // Parse
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        throw new DataError('Malformed JWT')
      }
    }

    // Input should be an object by now
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new DataError('Invalid JWT')
    }

    // Signatures must be present and an array
    if (!Array.isArray(data.signatures)) {
      throw new DataError('JWT signatures property must be an array')
    }

    // Decode payload
    try {
      payload = JSON.parse(base64url.decode(data.payload))
    } catch (err) {
      throw new Error('Invalid JWT')
    }

    // Decode signatures
    signatures = data.signatures.map(descriptor => {
      let { protected: protectedHeader, header: unprotectedHeader, signature } = descriptor
      let decodedHeader

      try {
        decodedHeader = JSON.parse(base64url.decode(protectedHeader))
      } catch (err) {
        throw new DataError('Invalid JWT')
      }

      if (!decodedHeader || typeof decodedHeader !== 'object' || decodedHeader === null || Array.isArray(decodedHeader)) {
        throw new DataError('JWT Protected Header must be an object')
      }

      if (unprotectedHeader && (typeof unprotectedHeader !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
        throw new DataError('JWT Header must be an object')
      }

      return {
        protected: decodedHeader,
        header: unprotectedHeader,
        signature
      }
    })

    // Normalize and return instance
    return new ExtendedJWT(
      clean({
        payload,
        signatures,
        serialization: 'json',
        type: 'JWS'
      })
    )
  }

  /**
   * from
   *
   * @description
   * Instanciate a JWT from an object descriptor
   *
   * @param {Object} data
   * @param {String} [data.serialized] - Existing serialized JWT
   *
   * @return {JWT}
   */
  static from (data) {
    let ExtendedJWT = this

    // Decode serialized token
    if (data.serialized) {
      return this.decode(data.serialized)
    }

    let { payload, signatures, serialization } = data

    if (!payload) {
      throw new DataError('Invalid JWT')
    }

    // Include compelete signature descriptors only
    if (signatures && Array.isArray(signatures)) {
      signatures = signatures.filter(descriptor => !descriptor.cryptoKey || descriptor.signature)
    } else {
      signatures = []
    }

    // Normalize existing flat signature
    if (!data.cryptoKey && data.signature) {
      let { protected: protectedHeader, header: unprotectedHeader, signature } = data
      let descriptor = {}

      if (!protectedHeader && unprotectedHeader) {
        descriptor.protected = unprotectedHeader
      } else {
        descriptor.protected = protectedHeader
        descriptor.header = unprotectedHeader
      }

      descriptor.signature = signature

      if (signatures && Array.isArray(signatures)) {
        signatures.unshift(descriptor)
      } else {
        signatures = [descriptor]
      }
    }

    return new ExtendedJWT(
      clean({
        payload,
        signatures,
        serialization,
        type: 'JWS'
      })
    )
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
    let params = Object.assign({}, ...data)
    let ExtendedJWT = this
    let token = this.from(params)

    return token.sign(params)
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
   * @param {...Object} data
   * @returns {Promise<JWT>}
   */
  static verify (...data) {
    let params = Object.assign({}, ...data)
    let ExtendedJWT = this
    let { jwt } = params

    if (!jwt) {
      throw new Error('JWT input required')
    }

    let token = this.decode(jwt)

    return token.verify(params)
  }

  /**
   * isJWE
   */
  isJWE () {
    let {
      header: unprotectedHeader,
      protected: protectedHeader,
      recipients
    } = this

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
   * @param {Object} data
   * @returns {Promise<SerializedToken>}
   */
  encode (data) {
    if (this.isJWE()) {
      return JWE.encrypt(this)
    } else {
      return this.sign(data)
    }
  }

  /**
   * sign
   *
   * @description
   * Sign a JWT instance
   *
   * @todo import different types of key
   *
   * @param {...Object} data
   * @returns {Promise<SerializedToken>}
   */
  sign (...data) {
    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    let params = Object.assign({}, ...data)
    let { payload } = this

    let {
      protected: protectedHeader,
      header: unprotectedHeader,
      signature,
      signatures,
      serialization,
      cryptoKey
    } = params

    // Override serialization
    if (serialization) {
      Object.defineProperty(this, 'serialization', {
        value: serialization,
        enumerable: false,
        configurable: true
      })
    }

    // Normalize new flat signature
    if (cryptoKey && !signature && (unprotectedHeader || protectedHeader)) {
      let descriptor = {}

      if (!protectedHeader && unprotectedHeader) {
        descriptor.protected = unprotectedHeader
      } else {
        descriptor.protected = protectedHeader
        descriptor.header = unprotectedHeader
      }

      descriptor.cryptoKey = cryptoKey

      // Add to signatures array
      if (signatures && Array.isArray(signatures)) {
        signatures.push(descriptor)
      } else {
        signatures = [descriptor]
      }
    }

    // Create signatures
    let promises = []
    if (signatures && Array.isArray(signatures)) {
      // Ignore ambiguous/invalid descriptors
      promises = signatures.filter(descriptor => {
        return descriptor.cryptoKey && !descriptor.signature

      // assemble and sign
      }).map(descriptor => {
        let {
          protected: protectedHeader,
          header: unprotectedHeader,
          signature,
          cryptoKey
        } = descriptor
        let { alg } = protectedHeader

        // Encode signature content
        let encodedHeader = base64url(JSON.stringify(protectedHeader))
        let encodedPayload = base64url(JSON.stringify(payload))
        let data = `${encodedHeader}.${encodedPayload}`

        return JWA.sign(alg, cryptoKey, data).then(signature => {
          return { protected: protectedHeader, header: unprotectedHeader, signature }
        })
      })
    }

    // Await signatures
    return Promise.all(promises).then(signatures => {
      if (signatures.length > 0) {
        if (this.signatures && Array.isArray(this.signatures)) {
          this.signatures = this.signatures.concat(signatures)
        } else {
          this.signatures = signatures
        }
      }

      return this.serialize()
    })
  }

  /**
   * verify
   *
   * @description
   * Verify a decoded JSON Web Token instance
   *
   * @todo jwk, jwkSet and pem key types
   *
   * @param {...Object} data
   * @returns {Promise<Boolean|Object>}
   */
  verify (...data) {
    let params = Object.assign({}, ...data)
    let { signatures, payload, serialization } = this
    let { validate, result, cryptoKey, cryptoKeys } = params

    // Validate instance
    if (validate) {
      let validation = this.validate()

      if (!validation.valid) {
        throw new Error(validation)
      }
    }

    // Encode payload
    let encodedPayload = base64url(JSON.stringify(payload))

    // Verify all signatures with a key present
    let promises = signatures.map((descriptor, index) => {

      let key
      // Get manually mapped key
      if (descriptor.cryptoKey) {
        key = descriptor.cryptoKey

      // Get corresponding key
      } else if (cryptoKeys
        && Array.isArray(cryptoKeys)
        && index < cryptoKeys.length
        && cryptoKeys[index]) {

        key = cryptoKeys[index]

      // Attempt to use the single key
      } else if (cryptoKey) {
        key = cryptoKey

      // No key to verify signature; ignore
      } else {
        return Promise.resolve(true)
      }

      let {
        protected: protectedHeader,
        header: unprotectedHeader,
        signature
      } = descriptor

      // no signature to verify
      if (!signature) {
        return Promise.reject(new DataError('Missing signature(s)'))
      }

      let { alg } = protectedHeader

      // Encode header and assemble signature verification data
      let encodedHeader = base64url(JSON.stringify(protectedHeader))
      let data = `${encodedHeader}.${encodedPayload}`

      // Verify signature and store result on the descriptor
      return JWA.verify(alg, key, signature, data).then(verified => {
        Object.defineProperty(signatures[index], 'verified', {
          value: verified,
          enumerable: false,
          configurable: true
        })
        return verified
      })
    })

    // Await verification results
    return Promise.all(promises).then(verified => {
      verified = verified.reduce((prev, val) => prev ? val : false, true)

      Object.defineProperty(this, 'verified', {
        value: verified,
        enumerable: false,
        configurable: true
      })

      if (!result || result === 'boolean') {
        return verified
      } else if (result === 'object' || result === 'instance') {
        return this
      }
    })
  }

  /**
   * toCompact
   *
   * @todo This needs some error checking: i.e. no signature or more than one signature?
   */
  toCompact () {
    let { payload, signatures } = this
    let protectedHeader, signature

    // Signatures present
    if (signatures && Array.isArray(signatures) && signatures.length > 0) {
      protectedHeader = signatures[0].protected
      signature = signatures[0].signature
    }

    if (!protectedHeader) {
      throw new DataError('Protected header is required')
    }

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
   * toFlattened
   *
   * @todo This needs some error checking: i.e. no signature or more than one signature?
   */
  toFlattened () {
    let { payload, signatures } = this
    let protectedHeader, unprotectedHeader, signature

    // Signatures present
    if (signatures && Array.isArray(signatures) && signatures.length > 0) {
      protectedHeader = signatures[0].protected
      unprotectedHeader = signatures[0].header
      signature = signatures[0].signature
    }

    if (!protectedHeader) {
      throw new DataError('Protected header is required')
    }

    // Encode protected header and payload
    let encodedPayload = base64url(JSON.stringify(payload))
    let encodedHeader = base64url(JSON.stringify(protectedHeader))

    if (this.isJWE()) {
      // TODO
    } else {
      return JSON.stringify({
        payload: encodedPayload,
        header: unprotectedHeader,
        protected: encodedHeader,
        signature
      })
    }
  }

  /**
   * toGeneral
   */
  toGeneral () {
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
          let {
            header: unprotectedHeader,
            protected: protectedHeader,
            signature
          } = descriptor

          // Encode protected header
          let encodedHeader = base64url(JSON.stringify(protectedHeader))

          return { header: unprotectedHeader, protected: encodedHeader, signature }
        })

        return JSON.stringify({
          payload: encodedPayload,
          signatures: serializedSignatures
        })

      // Return without signatures
      } else {
        return JSON.stringify({ payload: encodedPayload })
      }
    }
  }

  /**
   * serialize
   *
   * @description
   * Serialize a JWT instance to the preferred serialization
   *
   * @return {SerializedToken}
   */
  serialize () {
    let { serialization } = this

    switch (serialization) {
      case 'compact':
        return this.toCompact()
      case 'flattened':
        return this.toFlattened()
      case 'json':
        return this.toGeneral()
      default:
        throw new Error('Invalid serialization')
    }
  }
}

/**
 * Export
 */
module.exports = JWT
