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
   * Encode a JWT instance
   *
   * @param {Object} token
   * @returns {Promise}
   */
  static sign (token) {
    let payload = base64url(JSON.stringify(token.payload))

    // compact serialization
    if (token.serialization === 'compact') {
      let { key, header: { alg } } = token
      let header = base64url(JSON.stringify(token.header))
      let data = `${header}.${payload}`

      return JWA.sign(alg, key, data).then(signature => `${data}.${signature}`)
    }

    // JSON serialization
    if (token.serialization === 'json') {
      let { signatures } = token

      let promises = signatures.map(signature => {
        let { header, signature: existingSignature, key } = signature

        // Attempt to use existing signature
        if (existingSignature && !key) {
          return Promise.resolve(existingSignature)

        } else if (existingSignature && key) {
          // TODO

        // Create new signature
        } else {
          let { alg } = protected
          let protected = base64url(JSON.stringify(signature.protected))
          let data = `${protected}.${payload}`

          return JWA.sign(alg, key, data).then(signature => {
            return {
              protected,
              header,
              signature: base64url(signature)
            }
          })
        }
      })

      return Promise.all(promises).then(signatures => {
        return {
          payload,
          signatures
        }
      })
    }

    // Flattened serialization
    if (token.serialization === 'flattened') {
      let { key, header, protected } = token
      let { alg } = header
      let protected = base64url(JSON.stringify(protected))
      let data = `${protected}.${payload}`

      return JWA.sign(alg, key, data).then(signature => {
        payload,
        header,
        protected,
        signature
      })
    }

    return Promise.reject(new DataError('Unsupported serialization'))
  }

  /**
   * verify
   */
  static verify (jwt) {
    // multiple signatures
    if (jwt.signatures) {
      // ...
    }

    // one signature
    if (jwt.signature) {
      let [header, payload] = jwt.segments
      let data = `${header}.${payload}`
      let {key, signature, header: {alg}} = jwt

      return JWA.verify(alg, key, signature, data).then(verified => {
        jwt.verified = verified
        return verified
      })
    }

    // no signatures to verify
    return Promise.reject(new DataError('Missing signature(s)'))
  }
}

/**
 * Export
 */
module.exports = JWS
