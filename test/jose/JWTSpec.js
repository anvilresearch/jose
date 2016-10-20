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
const crypto = require('webcrypto')
const JWT = require('../../src/jose/JWT')
const JWTSchema = require('../../src/schemas/JWTSchema')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey} = require('../keys')

/**
 * Test data
 */
const compact = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0.eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0.FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'

const signature = 'FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'

/**
 * Tests
 */
describe('JWT', () => {

  /**
   * schema
   */
  describe('schema', () => {
    it('should return JWTSchema', () => {
      JWT.schema.should.equal(JWTSchema)
    })
  })

  /**
   * static decode
   */
  describe('static decode', () => {
    describe('non-string argument', () => {
      it('should throw a DataError', () => {
        expect(() => {
          JWT.decode(false)
        }).to.throw('JWT must be a string')
      })
    })

    describe('JWS JSON Serialization', () => {
      it('should throw malformed JWT')
      it('should return a JWT instance')
    })

    describe('JWS Flattened JSON Serialization', () => {
      it('should return a promise')
      it('should reject malformed JWT')
      it('should resolve a JWT instance')
    })

    describe('JWS Compact Serialization', () => {
      it('should throw DataError', () => {
        expect(() => {
          JWT.decode('wrong')
        }).to.throw('Invalid JWT compact serialization')
      })

      it('should return a JWT instance', () => {
        JWT.decode(compact).should.be.instanceof(JWT)
      })

      it('should set JWT type', () => {
        JWT.decode(compact).type.should.equal('JWS')
      })

      it('should set JWT segments', () => {
        JWT.decode(compact).segments.should.eql(compact.split('.'))
      })

      it('should set JWT header', () => {
        JWT.decode(compact).header
          .should.eql({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
      })

      it('should set JWT payload', () => {
        JWT.decode(compact).payload
          .should.eql({ iss: 'https://forge.anvil.io' })
      })

      it('should set JWT signature', () => {
        JWT.decode(compact).signature
          .should.eql(signature)
      })

      it('should set JWT serialization', () => {
        JWT.decode(compact).serialization
          .should.equal('compact')
      })
    })
  })

  describe('static encode', () => {})
  describe('static sign', () => {})
  describe('static verify', () => {})

  describe('isJWE', () => {
    it('should return true with "enc" header', () => {
      let token = new JWT({ header: { enc: 'A128GCM' } })
      token.isJWE().should.equal(true)
    })

    it('should return false without "enc" header', () => {
      let token = new JWT({ header: { alg: 'HS256' } })
      token.isJWE().should.equal(false)
    })
  })

  /**
   * encode
   */
  describe('encode', () => {
    it('should reject invalid JWT', () => {
      let jwt = new JWT({
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: null },
        key: RsaPrivateCryptoKey
      })

      return jwt.encode().should.be.rejected
    })

    it('should resolve a JWS Compact Serialization', () => {
      let jwt = new JWT({
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: 'https://forge.anvil.io' },
        key: RsaPrivateCryptoKey
      })

      return jwt.encode().should.eventually.equal(compact)
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    it('should reject invalid JWT', () => {
      let jwt = new JWT({
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: null },
        key: RsaPrivateCryptoKey
      })

      return jwt.verify().should.be.rejected
    })

    it('should resolve a boolean', () => {
      let jwt = new JWT({
        segments: [
          'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0',
          'eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0',
          signature
        ],
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: 'https://forge.anvil.io' },
        signature,
        key: RsaPublicCryptoKey
      })

      return jwt.verify().should.eventually.equal(true)
    })
  })
})
