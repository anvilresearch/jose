/**
 * Dependencies
 */
const base64url = require('base64url')
const JWA = require('./JWA')
const {DataError} = require('../errors')

/**
 * JWS
 */
class JWS {

  /**
   * sign
   *
   * @description
   * Encode a JWT or JWD instance
   *
   * @param {JWT|JWD} token
   * @returns {Promise<SerializedToken>}
   */
  static sign (token) {
    let { serialization, payload } = token
    let encodedPayload = base64url(JSON.stringify(payload))

    // Compact Serialization
    if (serialization === 'compact') {
      let { key, header: unprotectedHeader } = token
      let { alg } = unprotectedHeader
      let encodedHeader = base64url(JSON.stringify(unprotectedHeader))
      let data = `${encodedHeader}.${encodedPayload}`

      return JWA.sign(alg, key, data).then(signature => `${data}.${signature}`)
    }

    // Flattened Serialization
    if (serialization === 'flattened') {
      let { key, header: unprotectedHeader, protected: protectedHeader } = token
      let { alg } = protectedHeader
      let encodedHeader = base64url(JSON.stringify(protectedHeader))
      let data = `${encodedHeader}.${encodedPayload}`

      return JWA.sign(alg, key, data).then(signature => {
        return JSON.stringify({ payload: encodedPayload, header: unprotectedHeader, protected: encodedHeader, signature })
      })
    }

    // JSON General Serialization
    if (serialization === 'json') {
      let { signatures } = token

      let promises = signatures.map(descriptor => {
        let { header: unprotectedHeader, protected: protectedHeader, signature, key } = descriptor
        let { alg } = protectedHeader

        // Attempt to use existing signature
        if (signature && !key) {
          return Promise.resolve(descriptor)

        } else if (signature && key) {
          // TODO

        // Create new signature
        } else {
          let encodedHeader = base64url(JSON.stringify(protectedHeader))
          let data = `${encodedHeader}.${encodedPayload}`

          return JWA.sign(alg, key, data).then(signature => {
            return { protected: encodedHeader, header: unprotectedHeader, signature }
          })
        }
      })

      return Promise.all(promises).then(signatures => {
        return JSON.stringify({ payload: encodedPayload, signatures })
      })
    }

    if (serialization === 'document') {
      // TODO
    }

    return Promise.reject(new DataError('Unsupported serialization'))
  }

  /**
   * verify
   *
   * @description
   * Verify JWT or JWD signature(s)
   *
   * @param {JWT|JWD} token
   * @returns {Promise<Boolean>}
   */
  static verify (token) {
    let { signature, signatures, payload } = token

    // JSON Serialization
    if (signatures) {

      return Promise.all(signatures.map((descriptor, index) => {
        let { protected: protectedHeader, header, signature, key } = descriptor

        // Ignore if key is not present.
        if (!key) {
          return Promise.resolve(true)
        }

        let { alg } = protectedHeader
        let encodedHeader = base64url(JSON.stringify(protectedHeader))
        let encodedPayload = base64url(JSON.stringify(payload))
        let data = `${encodedHeader}.${encodedPayload}`

        return JWA.verify(alg, key, signature, data).then(verified => {
          Object.defineProperty(signatures[index], 'verified', { value: verified })
          return verified
        })

      // Ensure that all signatures were succesfully verified
      })).then(verified => {
        return verified.reduce((prev, val) => prev ? val : false, true)
      })

    }

    // Compact and Flattened Serialization
    if (signature) {
      let { header: unprotectedHeader, protected: protectedHeader, segments, key } = token

      // Compact Serialization
      if (segments) {
        let { alg } = unprotectedHeader
        let [encodedHeader, encodedPayload] = segments
        let data = `${encodedHeader}.${encodedPayload}`

        return JWA.verify(alg, key, signature, data).then(verified => {
          Object.defineProperty(token, 'verified', { value: verified })
          return verified
        })

      // Flattened Serialization
      } else {
        let { alg } = protectedHeader
        let encodedHeader = base64url(JSON.stringify(protectedHeader))
        let encodedPayload = base64url(JSON.stringify(payload))
        let data = `${encodedHeader}.${encodedPayload}`

        return JWA.verify(alg, key, signature, data).then(verified => {
          Object.defineProperty(token, 'verified', { value: verified })
          return verified
        })
      }
    }

    // no signatures to verify
    return Promise.reject(new DataError('Missing signature(s)'))
  }
}

/**
 * Export
 */
module.exports = JWS
