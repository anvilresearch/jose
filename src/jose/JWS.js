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
      let {key, header: {alg}} = token
      let header = base64url(JSON.stringify(token.header))
      let data = `${header}.${payload}`

      return JWA.sign(alg, key, data).then(signature => `${data}.${signature}`)
    }

    // JSON serialization
    if (token.serialization === 'json') {

    }

    // Flattened serialization
    if (token.serialization === 'flattened') {

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

    let {key, signature, header: {alg}} = jwt

    // one signature
    if (jwt.signature) {
      let [header, payload] = jwt.segments
      let data = `${header}.${payload}`

      if (alg === 'none') {
        return Promise.reject(new DataError('Signature provided to verify with alg: none'))
      }

      return JWA.verify(alg, key, signature, data).then(verified => {
        jwt.verified = verified
        return verified
      })
    }

    if (alg === 'none') {
      if (!key && !signature) {
        jwt.verified = true

        return Promise.resolve(true)
      }

      if (key) {
        return Promise.reject(new DataError('Key provided to verify signature with alg: none'))
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
