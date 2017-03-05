'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

/**
 * Assertions
 */
chai.use(chaiAsPromised)
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const crypto = require('webcrypto')
const { JWT } = require('../../src')
const JWTSchema = require('../../src/schemas/JWTSchema')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey} = require('../keys')

/**
 * Test data
 */
const compact = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0.eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0.FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'
const flattened = '{"payload":"eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0","header":{},"protected":"eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0","signature":"FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ"}'
const json = '{"payload":"eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0","signatures":[{"protected":"eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0","signature":"FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ"}]}'

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
      it('should reject with a DataError', (done) => {
        JWT.decode(false).should.be.rejectedWith('JWT must be a string').and.notify(done)
      })
    })

    describe('JWS JSON Serialization', () => {
      it('should return a promise', (done) => {
        JWT.decode(json).should.be.fulfilled.and.notify(done)
      })

      it('should throw malformed JWT', (done) => {
        JWT.decode('{wrong}')
          .should.be.rejectedWith('Invalid JWT serialization')
          .and.notify(done)
      })

      it('should resolve a JWT instance', (done) => {
        JWT.decode(json).should.eventually.be.instanceof(JWT)
          .and.notify(done)
      })

      it('should set JWT type', (done) => {
        JWT.decode(json).should.eventually.have.property('type')
          .that.equals('JWS').and.notify(done)
      })

      it('should set JWT payload', (done) => {
        JWT.decode(json).should.eventually.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })
          .and.notify(done)
      })

      it('should set JWT serialization', (done) => {
        JWT.decode(json).should.eventually.have.property('serialization')
          .that.equals('json')
          .and.notify(done)
      })

      it('should set JWT signatures', (done) => {
        JWT.decode(json).should.eventually.have.property('signatures')
          .and.notify(done)
      })

      describe('signatures', () => {

        it('should set JWT protected header', (done) => {
          JWT.decode(json).then(token => token.signatures[0])
            .should.eventually.have.property('protected')
            .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' }).and.notify(done)
        })

        it('should set JWT signature', (done) => {
          JWT.decode(json).then(token => token.signatures[0])
            .should.eventually.have.property('signature')
            .that.deep.equals(signature).and.notify(done)
        })
      })
    })

    describe('JWS Flattened JSON Serialization', () => {
      it('should return a promise', (done) => {
        JWT.decode(flattened).should.be.fulfilled.and.notify(done)
      })

      it('should reject malformed JWT', (done) => {
        JWT.decode('{wrong}')
          .should.be.rejectedWith('Invalid JWT serialization')
          .and.notify(done)
      })

      it('should resolve a JWT instance', (done) => {
        JWT.decode(flattened).should.eventually.be.instanceof(JWT)
          .and.notify(done)
      })

      it('should set JWT type', (done) => {
        JWT.decode(flattened).should.eventually.have.property('type')
          .that.equals('JWS').and.notify(done)
      })

      it('should set JWT protected header', (done) => {
        JWT.decode(flattened).should.eventually.have.property('protected')
          .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
          .and.notify(done)
      })

      it('should set JWT payload', (done) => {
        JWT.decode(flattened).should.eventually.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })
          .and.notify(done)
      })

      it('should set JWT signature', (done) => {
        JWT.decode(flattened).should.eventually.have.property('signature')
          .that.equals(signature)
          .and.notify(done)
      })

      it('should set JWT serialization', (done) => {
        JWT.decode(flattened).should.eventually.have.property('serialization')
          .that.equals('flattened')
          .and.notify(done)
      })
    })

    describe('JWS Compact Serialization', () => {
      it('should return a promise', (done) => {
        JWT.decode(compact).should.be.fulfilled.and.notify(done)
      })

      it('should reject malformed JWT with a DataError', (done) => {
        JWT.decode('wrong').should.be.rejectedWith('Malformed JWT')
          .and.notify(done)
      })

      it('should return a JWT instance', (done) => {
        JWT.decode(compact).should.eventually.be.instanceof(JWT)
          .and.notify(done)
      })

      it('should set JWT type', (done) => {
        JWT.decode(compact).should.eventually.have.property('type')
          .that.equals('JWS').and.notify(done)
      })

      it('should set JWT segments', (done) => {
        JWT.decode(compact).should.eventually.have.property('segments')
          .that.deep.equals(compact.split('.')).and.notify(done)
      })

      it('should set JWT header', (done) => {
        JWT.decode(compact).should.eventually.have.property('header')
          .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
          .and.notify(done)
      })

      it('should set JWT payload', (done) => {
        JWT.decode(compact).should.eventually.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })
          .and.notify(done)
      })

      it('should set JWT signature', (done) => {
        JWT.decode(compact).should.eventually.have.property('signature')
          .that.equals(signature)
          .and.notify(done)
      })

      it('should set JWT serialization', (done) => {
        JWT.decode(compact).should.eventually.have.property('serialization')
          .that.equals('compact')
          .and.notify(done)
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
   * resolveKeys
   */
  describe('resolveKeys', () => {
    let jwks, token

    beforeEach(() => {
      jwks = {
        keys: [
          { kid: '123', cryptoKey: {} },
          { use: 'sig', cryptoKey: {} }
        ]
      }

      token = new JWT({
        header: {
          alg: 'RS256'
        }
      })
    })

    it('should throw with invalid argument', () => {
      expect(() => {
        token.resolveKeys(false)
      }).to.throw('Invalid JWK argument')
    })

    it('should return true with match', () => {
      token.resolveKeys(jwks).should.equal(true)
    })

    it('should return false with no match', () => {
      token.header.kid = '234'
      token.resolveKeys(jwks).should.equal(false)
    })

    it('should match JWK by `kid`', () => {
      token.header.kid = '123'
      token.resolveKeys(jwks)
      token.key.should.equal(jwks.keys[0].cryptoKey)
    })

    it('should match JWK by `use`', () => {
      token.resolveKeys(jwks)
      token.key.should.equal(jwks.keys[1].cryptoKey)
    })
  })

  /**
   * encode
   */
  describe('encode', () => {
    it('should reject invalid JWT', (done) => {
      JWT.encode(RsaPrivateCryptoKey, {
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: null }
      }).should.be.rejected.and.notify(done)
    })

    it('should resolve a JWS Compact Serialization', (done) => {
      JWT.encode(RsaPrivateCryptoKey, {
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: 'https://forge.anvil.io' },
      }).should.eventually.equal(compact).and.notify(done)
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    it('should reject invalid JWT', (done) => {
      JWT.verify(RsaPublicCryptoKey, 'invalid')
        .should.be.rejected.and.notify(done)
    })

    it('should resolve a boolean', (done) => {
      JWT.verify(RsaPublicCryptoKey, compact).then(jwt => {
        jwt.verify().should.eventually.equal(true).and.notify(done)
      })
    })
  })
})
