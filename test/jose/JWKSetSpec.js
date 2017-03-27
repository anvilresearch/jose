'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const JWKSet = require('../../src/jose/JWKSet')
const JWKSetSchema = require('../../src/schemas/JWKSetSchema')

const jwks1 = `{
  "keys": [
    {
      "kid": "212OUymAqmI",
      "kty": "RSA",
      "alg": "RS256",
      "n": "pQEhHEjUCw8Dj5h4wbPWCX1EC6OrcmIvr_ejZS4mWYPFnq8Q_GI_R63mALFD_LCZTrcd_LaG0irmbhAGaYOe8bYl8gvDEyVgH-nK8GkPSWaW_3DXazXM2cT2lWmHoRUi3Eh6ouG-hEEU7D2rwstfAsp30BRRjrJFVqgu4hx3INTMiFhFDrKBfec-SR2JCJwttB9Tj8I-AaJSBkFcA4Q3xaYmrc-b0j7cVrCBqt6cZXuwoDEdGf3d-1eTiywEWYKi4eiOfw5tonwrgNCtVPk-q150nz6IckmiweROzrY8Mj0xfmPwfNK-H1KciPZ6eRWeHJLPJWslCuVLbqwRpLQzhQ",
      "e": "AQAB",
      "key_ops": [
        "verify"
      ],
      "ext": true
    }
  ]
}`

/**
 * Tests
 */
describe('JWKSet', () => {
  describe('schema', () => {
    it('should return JWKSetSchema')
  })

  describe('importKeys', () => {
    it('should return a promise')

    it('should reject invalid JWK Set', done => {
      const invalidJwks = { keys: 'invalid' }

      JWKSet.importKeys(invalidJwks)
        .catch(error => {
          expect(error).to.be.instanceOf(Error)
          done()
        })
    })

    it('should reject invalid JWK Set (no keys passed in)', done => {
      const jwksNoKeys = {}

      JWKSet.importKeys(jwksNoKeys)
        .catch(error => {
          expect(error).to.be.instanceOf(Error)
          done()
        })
    })

    it('should resolve imported JWKs', () => {
      let validJwks = JSON.parse(jwks1)

      return JWKSet.importKeys(validJwks)
        .then(keys => {
          expect(keys).to.exist
        })
    })
  })
})
