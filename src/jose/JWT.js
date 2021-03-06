'use strict'

/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('@trust/json-document')
const JWTSchema = require('../schemas/JWTSchema')
const { JWA } = require('@trust/jwa')
const DataError = require('../errors/DataError')
const KeyManagement = require('../KeyManagement')

const keyManagement = new KeyManagement

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
  constructor (data, options = {}) {
    options.filter = options.filter || false
    super(data, options)

    let { plaintext, type, serialization } = data

    Object.defineProperty(this, 'plaintext', {
      value: plaintext,
      configurable: true,
      enumerable: false
    })
    Object.defineProperty(this, 'type', {
      value: type,
      configurable: true,
      enumerable: false
    })
    Object.defineProperty(this, 'serialization', {
      value: serialization,
      configurable: true,
      enumerable: false
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
   * @param {String} token
   * @returns {JWT}
   */
  static decode (token) {
    if (typeof token !== 'string') {
      throw new DataError('Invalid JWT')
    }

    // Parse
    if (token.startsWith('{')) {
      try {
        token = JSON.parse(token)
      } catch (err) {
        throw new DataError('Malformed JWT')
      }
    }

    // Compact
    if (typeof token === 'string') {
      return this.fromCompact(token)
    }

    // JSON General
    if (token.signatures || token.recipients) {
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

    // Parse
    if (typeof data === 'string') {
      let segments = data.split('.')
      let protectedHeader

      if (![3, 5].includes(segments.length)) {
        throw new DataError('Malformed JWT')
      }

      try {
        protectedHeader = JSON.parse(base64url.decode(segments[0]))
      } catch (err) {
        throw new DataError('Malformed JWT protected header')
      }

      // Sanity Check
      if (typeof protectedHeader !== 'object'
          || protectedHeader === null || Array.isArray(protectedHeader)) {
        throw new DataError('JWT Header must be an object')
      }

      // Decode base64url
      if (segments.length === 3) {
        let payload, signature

        try {
          payload = JSON.parse(base64url.decode(segments[1]))
          signature = segments[2]
        } catch (err) {
          throw new DataError('Malformed JWS')
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

      if (segments.length === 5) {
        let encrypted_key, iv, ciphertext, tag

        encrypted_key = segments[1]
        iv = segments[2]
        ciphertext = segments[3]
        tag = segments[4]

        return new ExtendedJWT(
          clean({
            protected: protectedHeader,
            iv,
            ciphertext,
            tag,
            recipients: [
              { encrypted_key }
            ],
            serialization: 'compact',
            type: 'JWE'
          })
        )
      }
    }

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

    // decide if JWT is JWS(has payload) or JWE(has ciphertext)
    if (data.payload) {
      let protectedHeader, payload

      // Decode base64url
      try {
        payload = JSON.parse(base64url.decode(data.payload))
        protectedHeader = JSON.parse(base64url.decode(data.protected))
      } catch (err) {
        throw new Error('Invalid JWT')
      }

      // Fetch decoded values
      let { header: unprotectedHeader, signature } = data

      // Sanity Check
      if (typeof protectedHeader !== 'object' || protectedHeader === null
          || Array.isArray(protectedHeader)) {
        throw new DataError('JWT Protected Header must be an object')
      }

      if (unprotectedHeader &&
          (typeof unprotectedHeader !== 'object'
          || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
        throw new DataError('JWT Unprotected Header must be an object')
      }

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
    } else {
      let {
        protected: protect,
        unprotected: unprotect,
        iv,
        aad,
        ciphertext,
        tag,
        encrypted_key,
        header
      } = data

      if (data.recipients) {
        throw new Error('Flattened JWE must not have recipients field')
      }

      try {
        if (protect) {
          protect = JSON.parse(base64url.decode(data.protected))
        }
      } catch (err) {
        throw new Error('Invalid JWT')
      }

      return new ExtendedJWT(
        clean({
          protected: protect,
          unprotected: unprotect,
          iv,
          aad,
          ciphertext,
          tag,
          recipients: [
            { header, encrypted_key }
          ],
          serialization: 'flattened',
          type: 'JWE'
        })
      )
    }
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

    // decide if JWT is JWS(has payload) or JWE(has ciphertext)
    if (data.payload) {
      let payload, signatures

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
        let {
          protected: protectedHeader,
          header: unprotectedHeader,
          signature
        } = descriptor
        let decodedHeader

        try {
          decodedHeader = JSON.parse(base64url.decode(protectedHeader))
        } catch (err) {
          throw new DataError('Invalid JWT')
        }

        if (!decodedHeader || typeof decodedHeader !== 'object'
            || decodedHeader === null || Array.isArray(decodedHeader)) {
          throw new DataError('JWT Protected Header must be an object')
        }

        if (unprotectedHeader &&
            (typeof unprotectedHeader !== 'object'
            || unprotectedHeader === null
            || Array.isArray(unprotectedHeader))) {
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
    } else {
      let protect, unprotect, iv, aad, ciphertext, tag, recipients

      try {
        if (data.protected) {
          protect = JSON.parse(base64url.decode(data.protected))
        }
      } catch (err) {
        throw new Error('Invalid JWT')
      }

      if (data.unprotected && (typeof data.unprotected !== 'object'
          || data.unprotected === null || Array.isArray(data.unprotected))) {
        throw new DataError('JWE Unprotected Header must be an object')
      }
      unprotect = data.unprotected
      iv = data.iv
      aad = data.aad
      if (!data.ciphertext) {
        throw new DataError("Ciphertext member not present")
      }
      ciphertext = data.ciphertext
      tag = data.tag

      if (!Array.isArray(data.recipients)) {
        throw new DataError('JWT recipients property must be an array')
      }

      recipients = data.recipients.map(descriptor => {
        let { header, encrypted_key } = descriptor

        if (header && (typeof header !== 'object' ||
              header === null || Array.isArray(header))) {
          throw new DataError('JWE Header must be an object')
        }

        return {
          header,
          encrypted_key
        }
      })

      return new ExtendedJWT(
        clean({
          protected: protect,
          unprotected: unprotect,
          iv,
          aad,
          ciphertext,
          tag,
          recipients,
          serialization: 'json',
          type: 'JWE'
        })
      )
    }
  }

  /**
   * from
   *
   * @description
   * Instanciate a JWT from an object descriptor
   *
   * @param {Object|String} data
   * @param {String} [data.serialized] - Existing serialized JWT
   *
   * @return {JWT}
   */
  static from (data) {
    let ExtendedJWT = this

    // Decode serialized token
    if (typeof data === 'string' || data.serialized) {
      return this.decode(data.serialized || data)
    }

    if (data.ciphertext || data.plaintext) {

      let {protected: protect, unprotected, iv, aad,
        plaintext, ciphertext, tag, recipients, serialization, filter} = data

      if (!plaintext && !ciphertext) {
        throw new DataError('Invalid JWT')
      }

      //filter the recipients
      if (recipients && Array.isArray(recipients)) {
        recipients = recipients.filter(descriptor => descriptor.encrypted_key)
      } else {
        recipients = []
      }

      // Normalize existing flat recipient
      if (data.encrypted_key) {
        let { header, encrypted_key } = data
        let descriptor

        descriptor.header = header
        descriptor.encrypted_key = encrypted_key

        if (recipients && Array.isArray(recipients)) {
          recipients.unshift(descriptor)
        } else {
          recipients = [descriptor]
        }
      }
      return new ExtendedJWT(
        clean({
          protected: protect,
          unprotected,
          iv,
          aad,
          plaintext,
          ciphertext,
          tag,
          recipients,
          serialization,
          type: 'JWE'
        }),
        {
          filter: filter ||
            (ExtendedJWT.name !== 'JWT' && ExtendedJWT.name !== 'JWD')
        }
      )

    } else {

      let { payload, signatures, serialization, filter } = data

      if (!payload) {
        throw new DataError('Invalid JWT')
      }

      // Include complete signature descriptors only
      if (signatures && Array.isArray(signatures)) {
        signatures = signatures.filter(
          descriptor => !descriptor.cryptoKey || descriptor.signature
        )
      } else {
        signatures = []
      }

      // Normalize existing flat signature
      if (!data.cryptoKey && data.signature) {
        let {
          protected: protectedHeader,
          header: unprotectedHeader,
          signature
        } = data
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
        }),
        {
          filter: filter ||
            (ExtendedJWT.name !== 'JWT' && ExtendedJWT.name !== 'JWD')
        }
      )
    }
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

    // Try decode
    let instance
    try {
      instance = this.from(params)
    } catch (e) {
      return Promise.reject(e)
    }

    return instance.sign(params)
  }

  /**
   * encode
   *
   * @description
   * Encode a JSON Web Token
   *
   * @param {...Object} data
   *
   * @returns {Promise<SerializedToken>}
   */
  static encode (...data) {
    // Shallow merge data
    let params = Object.assign({}, ...data)

    // Try decode
    let instance
    try {
      instance = this.from(params)
    } catch (e) {
      return Promise.reject(e)
    }

    return instance.encode(params)
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
    let { serialized } = params

    if (!serialized) {
      throw new Error('JWT input required')
    }

    // Try decode
    let instance
    try {
      instance = this.from(serialized)
    } catch (e) {
      return Promise.reject(e)
    }

    return instance.verify(params)
  }

  /**
   * encrypt
   *
   * @description
   * Encrypt the contents of a JSON Web Token
   *
   * @param {...Object} data
   * @returns {Promise<JWT>}
   */
  static encrypt (...data) {
    let params = Object.assign({}, ...data)

    // Try decode
    let instance
    try {
      instance = this.from(params)
    } catch (e) {
      return Promise.reject(e)
    }

    return instance.encrypt(params)
  }

  /**
   * decrypt
   *
   * @description
   * Decrypt the contents of a JSON Web Token
   *
   * @param {...Object} data
   * @returns {Promise<JWT>}
   */
  static decrypt (...data) {
    let params = Object.assign({}, ...data)
    let { serialized } = params

    if (!serialized) {
      throw new Error('JWT input required')
    }

    // Try decode
    let instance
    try {
      instance = this.from(serialized)
    } catch (e) {
      return Promise.reject(e)
    }

    return instance.decrypt(params)
  }

  /**
   * isJWE
   *
   * @todo
   */
  isJWE () {
    // check if type is set to JWE
    // check if ciphertext member exists
    // check jose header for alg, enc field
    // TODO: check alg, check for enc in all headers
    return this.type === 'JWE' || this.ciphertext !== undefined ||
          (this.header !== undefined && this.header.enc !== undefined)
  }

  /**
   * resolveKeys
   *
   * @todo  This needs to be updated for use with the new API
   */
  // resolveKeys (jwks) {
  //   let kid = this.header.kid

  //   let keys, match

  //   // treat an array as the "keys" property of a JWK Set
  //   if (Array.isArray(jwks)) {
  //     keys = jwks
  //   }

  //   // presence of keys indicates object is a JWK Set
  //   if (jwks.keys) {
  //     keys = jwks.keys
  //   }

  //   // wrap a plain object they is not a JWK Set in Array
  //   if (!jwks.keys && typeof jwks === 'object') {
  //     keys = [jwks]
  //   }

  //   // ensure there are keys to search
  //   if (!keys) {
  //     throw new DataError('Invalid JWK argument')
  //   }

  //   // match by "kid" or "use" header
  //   if (kid) {
  //     match = keys.find(jwk => jwk.kid === kid)
  //   } else {
  //     match = keys.find(jwk => jwk.use === 'sig')
  //   }

  //   // assign matching key to JWT and return a boolean
  //   if (match) {
  //     console.log(match)
  //     this.key = match.cryptoKey
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  /**
   * encode
   *
   * @description
   * Encode a JSON Web Token instance
   *
   * @param {...Object} data
   * @returns {Promise<SerializedToken>}
   */
  encode (...data) {
    let params = Object.assign({}, ...data)

    if (this.isJWE()) {
      return this.encrypt(params)
    } else {
      return this.sign(params)
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
    let params = Object.assign({}, ...data)

    let { payload } = this

    let {
      protected: protectedHeader,
      header: unprotectedHeader,
      signature,
      signatures,
      serialization,
      cryptoKey,
      validate = true,
      result
    } = params

    if (validate) {
      let validation = this.validate()

      if (!validation.valid) {
        return Promise.reject(validation)
      }
    }

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
          return {
            protected: protectedHeader,
            header: unprotectedHeader,
            signature
          }
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

      if (!result || result === 'string') {
        return this.serialize()
      } else if (result === 'object' || result === 'instance') {
        return this
      }
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
   * encrypt
   *
   * @description
   * Encrypt the given data and create a JSON Web Encryption instance
   *
   * @param {...Object} data
   * @returns {Promise<SerializedToken>}
   */
  encrypt (...data) {
    let params = Object.assign({}, ...data)

    let { key } = params

    let {
      protected: protectedHeader,
      unprotected: unprotectedHeader,
      plaintext,
      aad,
      tag,
      recipients
    } = this

    let alg, cek, encrypted_key
    if (recipients.length > 0) {
      recipients.map(recipient => {
        alg = recipient.header.alg || protectedHeader.alg
        let result = keyManagement.determineCek(false, alg, key)
        recipient.encrypted_key = result.encrypted_key
      })
      // do the steps for each recipient
    } else {
      alg = protectedHeader.alg
      let result = keyManagement.determineCek(false, alg, key)
      cek = result.cek
      encrypted_key = base64url(result.encrypted_key)
      this.recipients.push({encrypted_key})
    }

    // iv is generated and encoded in the specific class

    // check and apply compression algorithm
    if (protectedHeader.zip) {
      // JWA.compress()
    }

    if (!protectedHeader) {
      protectedHeader = ""
    }
    let encodedHeader = base64url(JSON.stringify(protectedHeader))
    if (aad) {
      let encodedAad = base64url(aad)
      aad = `${encodedHeader}.${encodedAad}`
    } else {
      aad = encodedHeader
    }

    return Promise.resolve(
      JWA.encrypt(protectedHeader.enc, cek, plaintext, aad)
      .then(({ iv, ciphertext, tag }) => {
        this.iv = iv
        this.ciphertext = ciphertext
        this.tag = tag
      })
      .then(() => {
        return this.serialize()
      })
    )
  }

  /**
   * decrypt
   *
   * @description
   * Decrypt the contents of a JSON Web Token instance
   *
   * @param {...Object} data
   * @returns {Promise<Object>}
   */
  decrypt (...data) {
    let params = Object.assign({}, ...data)

    let {
      protected: protectedHeader,
      unprotected,
      iv,
      aad = "",
      ciphertext,
      tag,
      recipients,
      serialization
    } = this

    let { key } = params

    aad = base64url.decode(aad)

    if (!protectedHeader) {
      protectedHeader = ""
    }
    let encodedHeader = base64url(JSON.stringify(protectedHeader))
    if (aad) {
      let encodedAad = base64url(aad)
      aad = `${encodedHeader}.${encodedAad}`
    } else {
      aad = encodedHeader
    }

    let decryptionSucceeded = false

    let promises = recipients.map(recipient => {
      let encrypted_key = recipient.encrypted_key
      encrypted_key = base64url.decode(encrypted_key)

      let joseHeader
      if (serialization === 'compact') {
        joseHeader = Object.assign({}, protectedHeader)
      } else {
        let recipientHeader
        // the protected header was verified in from method
        try {
          if (unprotected) {
            unprotected = JSON.parse(unprotected)
          }
          if (recipient.header) {
            recipientHeader = JSON.parse(recipient.header)
          }
          joseHeader = Object.assign({}, protectedHeader,
            unprotected, recipientHeader)
          // the same Header Parameter name also
          // MUST NOT occur in distinct JSON object
          // values that together comprise the JOSE Header
          let protectedKeys = protectedHeader ?
                              new Set(Object.keys(protectedHeader)) :
                              []
          let unprotectedKeys = unprotected ?
                              new Set(Object.keys(unprotected)) :
                              []
          let recipientKeys = recipientHeader ?
                              new Set(Object.keys(recipientHeader)) :
                              []
          let intersection
          intersection = new Set(
            [...unprotectedKeys].filter(x => protectedKeys.has(x))
          )
          if (intersection.size !== 0) {
            throw new Error('Duplicated header parameters')
          }
          intersection = new Set(
            [...unprotectedKeys].filter(x => recipient.has(x))
          )
          if (intersection.size !== 0) {
            throw new Error('Duplicated header parameters')
          }
          intersection = new Set(
            [...recipientKeys].filter(x => protectedKeys.has(x))
          )
          if (intersection.size !== 0) {
            throw new Error('Duplicated header parameters')
          }
        } catch (err) {
          throw new DataError('Header is not a valid object')
        }
      }
      // verify fields - schemas
      // 6. determine the kmm
      // 7. verify the key ? what does this mean ?
      let alg = (recipient.header && recipient.header.alg || protectedHeader.alg)
      try {
        if (alg === 'dir' && encrypted_key.length !== 0) {
          throw new DataError(
            "JWE encrypted key is not empty for a direct encryption"
          )
        }
        let { cek } = keyManagement.determineCek(true, alg, key)
        Object.defineProperty(recipient, 'cekDetermined', {
          value: true,
          enumerable: false,
          configurable: true
        })
        return JWA.decrypt(protectedHeader.enc, cek, ciphertext, iv, tag, aad)
        .then(result => {
          if (joseHeader.zip) {
            // JWA.decompress()
          }
          Object.defineProperty(recipient, 'decrptedSuccessfully', {
            value: true,
            enumerable: true,
            configurable: true
          })
          decryptionSucceeded = true
          Object.defineProperty(recipient, 'result', {
            value: result,
            enumerable: true,
            configurable: true
          })
          return recipient
        })
      } catch (err) {

      }
    })

    // Await verification results
    return Promise.all(promises).then(() => {
      if (!decryptionSucceeded) {
        return Promise.reject("Decryption failed for all recipients")
      }
      if (serialization === 'json') {
        return recipients
      } else {
        return recipients[0].result
      }
    })

  }

  /**
   * toCompact
   */
  toCompact () {
    if(!this.isJWE()) {
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

      // Return compact JWT with signature
      if (signature) {
        return `${data}.${signature}`

      // Return compact JWT without signature
      } else {
        return `${data}.`
      }
    } else {
      let { protected: protectedHeader, iv, aad, ciphertext, tag } = this

      if(!protectedHeader) {
        throw new DataError('Protected header is required')
      }

      // Encode protected header
      // Key, iv, ciphertext, tag are already stored in base64url format
      let encodedHeader = base64url(JSON.stringify(protectedHeader))
      let key = this.recipients[0].encrypted_key

      let data = `${encodedHeader}.${key}.${iv}.${ciphertext}`

      // Return compact JWT
      if (tag) {
        return `${encodedHeader}.${key}.${iv}.${ciphertext}.${tag}`
      } else {
        return `${data}.`
      }
    }
  }

  /**
   * toFlattened
   */
  toFlattened () {

    if(!this.isJWE()) {
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

      return JSON.stringify({
        payload: encodedPayload,
        header: unprotectedHeader,
        protected: encodedHeader,
        signature
      })
    } else {
      let { protected: protectedHeader,
        unprotected, iv, aad, ciphertext, tag } = this

      if(!protectedHeader) {
        throw new DataError('Protected header is required')
      }
      // Encode protected header and payload
      let encodedHeader = base64url(JSON.stringify(protectedHeader))

      let header = this.recipients[0].header;
      let encrypted_key = this.recipients[0].encrypted_key;

      return JSON.stringify({
        protected: encodedHeader,
        unprotected,
        header,
        encrypted_key,
        aad,
        iv,
        ciphertext,
        tag
      })
    }
  }

  /**
   * toGeneral
   */
  toGeneral () {

    if (this.isJWE()) {
      let { protected: protectedHeader,
        unprotected, iv, aad, ciphertext, tag, recipients } = this

      if(!protectedHeader) {
        protectedHeader = ""
      }
      // Encode protected header and payload
      let encodedHeader = base64url(JSON.stringify(protectedHeader))

      // Serialize recipient info
      let serializedRecipients = recipients.map(descriptor => {
        return JSON.stringify(descriptor)
      })

      return JSON.stringify({
        protected: encodedHeader,
        unprotected,
        recipients,
        aad,
        iv,
        ciphertext,
        tag
      })

    } else {
      let { payload, signatures } = this

      // Encode payload
      let encodedPayload = base64url(JSON.stringify(payload))

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

          return {
            header: unprotectedHeader,
            protected: encodedHeader,
            signature
          }
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
   * toJWD
   *
   * @description
   * Convert a JWT to a JWD
   *
   * @return {JWD}
   */
  toJWD () {
    const JWD = require('./JWD')
    return new JWD(this)
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
      case 'document':
        return this.toJWD().toDocumentGeneral()
      case 'flattened-document':
        return this.toJWD().toDocumentFlattened()
      default:
        return this.toGeneral()
    }
  }
}

/**
 * Export
 */
module.exports = JWT
