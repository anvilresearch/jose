/**
 * Dependencies
 */
const base64url = require('base64url')
const {JSONDocument} = require('json-document')
const JWDSchema = require('../schemas/JWDSchema')
const JWS = require('./JWS')
const DataError = require('../errors/DataError')

/**
 * JWD
 */
class JWD extends JSONDocument {

  /**
   * schema
   */
  static get schema () {
    return JWDSchema
  }

  /**
   * decode
   *
   * @description
   * Decode a JSON Web Document
   *
   * @param {String} data
   *
   * @returns {Promise<JWD>}
   */
  static decode (data) {
    let ExtendedJWD = this

    if (typeof data !== 'string') {
      return Promise.reject(new DataError('JWD must be a string'))
    }

    try {
      data = JSON.parse(data)
    } catch (error) {
      return Promise.reject(new DataError('Invalid JWD'))
    }

    let doc = new ExtendedJWD(data)

    Object.defineProperty(doc, 'serialization', { value: 'document', enumerable: false })
    Object.defineProperty(doc, 'type', { value: 'JWS', enumerable: false })

    return Promise.resolve(doc)
  }

  /**
   * encode
   *
   * @description
   * Encode a JSON Web Document
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
    let ExtendedJWD = this
    let doc = new ExtendedJWD(data)

    if (!key) {
      return Promise.reject(new DataError('Key required to encode JWD'))
    }

    // Assign options to JWD as nonenumerable properties
    Object.keys(options).forEach(field => {
      Object.defineProperty(doc, field, { value: options[field], enumerable: false })
    })

    if (key.encrypt) {
      // TODO Encryption
      // Object.defineProperty(descriptor, 'encryption_key', {
      //   value: key.encrypt,
      //   enumerable: false
      // })
    }

    let { signatures } = doc

    // Assign key to new signature
    doc.signatures = signatures.map(descriptor => {

      if (!descriptor.signature) {
        Object.defineProperty(descriptor, 'key', { value: key.sign ? key.sign : key, enumerable: false })
      }

      return descriptor
    })

    if (!doc.serialzation) {
      Object.defineProperty(doc, 'serialization', { value: 'document', enumerable: false })
    }

    return doc.encode()
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
   * @returns {Promise<JWD>}
   */
  static verify (key, data, options={}) {
    let ExtendedJWD = this
    let jwd

    // Decode
    return ExtendedJWD.decode(data).then(doc => {
      let { signatures } = doc
      jwd = doc

      // Assign options to JWD as nonenumerable properties
      Object.keys(options).forEach(field => {
        Object.defineProperty(doc, field, { value: options[field], enumerable: false })
      })

      // Map keys to signatures by index
      if (Array.isArray(key) && signatures) {
        doc.signatures = signatures.map((descriptor, index) => {
          // TODO more sophisticated key mapping using hints like `kid'
          if (index < key.length) {
            Object.defineProperty(descriptor, 'key', { value: key[index], enumerable: false })
          }

          return descriptor
        })

      // Assign single key to all signatures as nonenumerable property
      } else if (signatures) {
        doc.signatures = signatures.map(descriptor => {
          Object.defineProperty(descriptor, 'key', { value: key, enumerable: false })
          return descriptor
        })

      // Assign key to document as nonenumerable property
      } else {
        Object.defineProperty(doc, 'key', { value: key, enumerable: false })
      }

      return doc.verify()
    }).then(verified => jwd)
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

    // assign matching key to JWD and return a boolean
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
module.exports = JWD
