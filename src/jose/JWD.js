/**
 * Dependencies
 * @ignore
 */
const base64url = require('base64url')
const JWT = require('./JWT')
const DataError = require('../errors/DataError')

/**
 * Helper Functions
 * @ignore
 */
function clean (input) {
  return JSON.parse(JSON.stringify(input))
}

/**
 * JWD
 */
class JWD extends JWT {

  /**
   * decode
   *
   * @description
   * Decode a JSON Web Document
   *
   * @param {String} token
   *
   * @returns {JWT}
   */
  static decode (token) {
    let ExtendedJWD = this

    if (typeof token !== 'string') {
      throw new DataError('Invalid JWD')
    }

    if (!token.startsWith('{')) {
      throw new DataError('Malformed JWD')
    }

    // Parse
    try {
      token = JSON.parse(token)
    } catch (err) {
      throw new DataError('Malformed JWD')
    }

    // Document General
    if (token.signatures) {
      return this.fromDocumentGeneral(token)

    // Document Flattened
    } else {
      return this.fromDocumentFlattened(token)
    }
  }

  /**
   * fromDocumentFlattened
   *
   * @description
   * Deserialize a Compact JWT and instantiate an instance
   *
   * @param  {String} data
   * @return {JWT}
   */
  static fromDocumentFlattened (data) {
    let ExtendedJWD = this

    // Parse
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        throw new DataError('Malformed JWD')
      }
    }

    // Input should be an object by now
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new DataError('Invalid JWD')
    }

    let { protected: protectedHeader, header: unprotectedHeader, payload, signature } = data

    // Sanity Check
    if (typeof protectedHeader !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
      throw new DataError('JWT Header must be an object')
    }

    if (unprotectedHeader && (typeof unprotectedHeader !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
      throw new DataError('JWT Header must be an object')
    }

    // Normalize and return instance
    return new ExtendedJWD(
      clean({
        payload,
        signatures: [
          { protected: protectedHeader, header: unprotectedHeader, signature }
        ],
        serialization: 'document-flattened',
        type: 'JWS'
      })
    )
  }

  /**
   * fromDocumentGeneral
   *
   * @description
   * Deserialize a General JWD and instantiate an instance
   *
   * @param  {String} data
   * @return {JWD}
   */
  static fromDocumentGeneral (data) {
    let ExtendedJWD = this

    // Parse
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        throw new DataError('Malformed JWD')
      }
    }

    // Input should be an object by now
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new DataError('Invalid JWD')
    }

    // Signatures must be present and an array
    if (!Array.isArray(data.signatures)) {
      throw new DataError('JWD signatures property must be an array')
    }

    let { payload, signatures } = data

    // Normalize and return instance
    return new ExtendedJWD(
      clean({
        payload,
        signatures,
        serialization: 'document',
        type: 'JWS'
      })
    )
  }

  /**
   * toDocumentFlattened
   */
  toDocumentFlattened () {
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

    if (this.isJWE()) {
      // TODO
    } else {
      return JSON.stringify({
        payload,
        header: unprotectedHeader,
        protected: protectedHeader,
        signature
      })
    }
  }

  /**
   * toDocumentGeneral
   */
  toDocumentGeneral () {
    let { payload, signatures } = this

    if (this.isJWE()) {
      // TODO
    } else {
      return JSON.stringify({ payload, signatures })
    }
  }

  /**
   * toJWT
   *
   * @description
   * Convert a JWD to a JWT
   *
   * @return {JWT}
   */
  toJWT () {
    const JWT = require('./JWT')
    return new JWT(this)
  }

  /**
   * serialize
   *
   * @description
   * Serialize a JWD instance to the preferred serialization
   *
   * @return {SerializedToken}
   */
  serialize () {
    let { serialization } = this

    switch (serialization) {
      case 'compact':
        return this.toJWT().toCompact()
      case 'flattened':
        return this.toJWT().toFlattened()
      case 'json':
        return this.toJWT().toGeneral()
      case 'document':
        return this.toDocumentGeneral()
      case 'flattened-document':
        return this.toDocumentFlattened()
      default:
        return this.toDocumentGeneral()
    }
  }
}

/**
 * Export
 */
module.exports = JWD
