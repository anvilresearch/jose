/**
 * Dependencies
 */
const base64url = require('base64url')
const JWA = require('./JWA')
const JWT = require('./JWT')

/**
 * JWS Schema
 */
const schema = JWT.schema.extend({
  type: 'object',
  properties: {

    /**
     * JOSE Header
     */
    header: {
      properties: {
        alg: {
          type: 'string',
          format: 'StringOrURI',
          enum: [
            'HS256',
            'HS384',
            'HS512',
            'RS256',
            'RS384',
            'RS512',
            'ES256',
            'ES384',
            'ES512',
            'PS256',
            'PS384',
            'PS512',
            'none'
          ]
        },
        jku: {
          type: 'string',
          format: 'url'
        },
        jwk: {
          $ref: 'https://...#jwk'
        },
        kid: {
          type: 'string'
        },
        x5u: {
          type: 'string',
          format: 'url'
        },
        x5c: {
          type: 'array',
          format: 'base64' // NOT base64url
        },
        x5t: {
          type: 'string',
          format: 'base64url' // NOT base64
        },
        //'x5t#256': {
        //  type: 'string',
        //  format: 'base64url'
        //},

        // TODO
        typ: {
          type: 'string',
          format: 'MediaType'
        },

        // TODO
        cty: {
          type: 'string',
          format: 'MediaType'
        },

        crit: {
          type: 'array',
          enum: [] // is this possible?
        }
      },
      required: [
        'alg'
      ]
    }
  }
})


/**
 * JWS
 */
class JWS extends JWT {

  /**
   * schema
   */
  static get schema () {
    return schema
  }

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
   * encode
   *
   * @description
   * Encode a JWT instance
   *
   * @param {CryptoKey} key
   * @returns {Promise}
   */
  encode (key) {
    let validation = this.validate()

    if (!validation.valid) {
      return Promise.reject(validation)
    }

    let algorithm = this.header.alg
    let header = base64url(JSON.stringify(this.header))
    let payload = base64url(JSON.stringify(this.payload))
    let data = `${header}.${payload}`

    return JWA
      .sign(algorithm, key, data)
      .then(signature => `${data}.${signature}`)
  }
}

/**
 * Export
 */
module.exports = JWS
