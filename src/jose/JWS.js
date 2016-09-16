/**
 * Dependencies
 */
const base64url = require('base64url')
const JWA = require('./JWA')

/**
 * JWS
 */
class JWS {

  /**
   * decode
   *
   * @description
   * Decode a JSON Web Token
   *
   * @param {string} token
   * @param {CryptoKey} key
   *
   * @returns {Promise}
   */
  static decode (token, key) {
    let header, payload, algorithm, signature, data

    try {
      let components = JWS.extractComponents(token)
      header = JSON.parse(base64url.decode(components[0]))
      payload = JSON.parse(base64url.decode(components[0]))
      algorithm = header.alg
      signature = components[2]
      data = components.slice(0,2).join('.')
    } catch (error) {
      return Promise.reject(error)
    }

    return JWA.verify(algorithm, key, signature, data).then(verified => {
      let jws = null

      if (verified) {
        let extendedJWS = this
        jws = new extendedJWS(header, payload, signature)
      }

      return jws
    })
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
    let jws = new JWS(header, payload)
    return jws.encode(key)
  }

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

    throw new DataError('Unsupported serialization')
  }
}

/**
 * Export
 */
module.exports = JWS
