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
const crypto = require('@trust/webcrypto')
const { JWT } = require('../../src')
const JWTSchema = require('../../src/schemas/JWTSchema')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey} = require('../keys')

/**
 * Test data
 */
const compact = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0.eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0.FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'
const flattened = '{"payload":"eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0","protected":"eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0","signature":"FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ"}'
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
      it('should throw with a DataError', () => {
        expect(() => {
          JWT.decode(false)
        }).to.throw('Invalid JWT')
      })
    })

    describe('JWS JSON Serialization', () => {
      it('should throw malformed JWT', () => {
        expect(() => {
          JWT.decode('{wrong}')
        }).to.throw('Malformed JWT')
      })

      it('should return an instance', () => {
        JWT.decode(json).should.be.instanceof(JWT)
      })

      it('should set JWT type', () => {
        JWT.decode(json).should.have.property('type').that.equals('JWS')
      })

      it('should set JWT payload', () => {
        JWT.decode(json).should.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })
      })

      it('should set JWT serialization', () => {
        JWT.decode(json).should.have.property('serialization')
          .that.equals('json')
      })

      it('should set JWT signatures', () => {
        JWT.decode(json).should.have.property('signatures')
      })

      describe('signatures', () => {

        it('should set JWT protected header', () => {
          JWT.decode(json).signatures[0].should.have.property('protected')
            .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
        })

        it('should set JWT signature', () => {
          JWT.decode(json).signatures[0].should.have.property('signature')
            .that.deep.equals(signature)
        })
      })
    })

    describe('JWS Flattened JSON Serialization', () => {
      it('should throw malformed JWT', () => {
        expect(() => {
          JWT.decode('{wrong}')
        }).to.throw('Malformed JWT')
      })

      it('should return a JWT instance', () => {
        JWT.decode(flattened).should.be.instanceof(JWT)
      })

      it('should set JWT type', () => {
        JWT.decode(flattened).should.have.property('type').that.equals('JWS')
      })

      it('should set JWT protected header', () => {
        JWT.decode(flattened).signatures[0].should.have.property('protected')
          .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
      })

      it('should set JWT payload', () => {
        JWT.decode(flattened).should.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })

      })

      it('should set JWT signature', () => {
        JWT.decode(flattened).signatures[0].should.have.property('signature')
          .that.equals(signature)

      })

      it('should set JWT serialization', () => {
        JWT.decode(flattened).should.have.property('serialization')
          .that.equals('flattened')

      })
    })

    describe('JWS Compact Serialization', () => {
      it('should reject malformed JWT with a DataError', () => {
        expect(() => {
          JWT.decode('wrong')
        }).to.throw('Malformed JWT')

      })

      it('should return a JWT instance', () => {
        JWT.decode(compact).should.be.instanceof(JWT)
      })

      it('should set JWT type', () => {
        JWT.decode(compact).should.have.property('type')
          .that.equals('JWS')
      })

      it('should set JWT protected header', () => {
        JWT.decode(compact).signatures[0].should.have.property('protected')
          .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })

      })

      it('should set JWT payload', () => {
        JWT.decode(compact).should.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })

      })

      it('should set JWT signature', () => {
        JWT.decode(compact).signatures[0].should.have.property('signature')
          .that.equals(signature)

      })

      it('should set JWT serialization', () => {
        JWT.decode(compact).should.have.property('serialization')
          .that.equals('compact')

      })
    })
  })

  describe('static encode', () => {})
  describe('static sign', () => {})
  describe('static verify', () => {})

  describe.skip('isJWE', () => {
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
  describe.skip('resolveKeys', () => {
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
    describe('with Extended JWT', () => {

      class ExtendedJWT extends JWT {}

      it('should reject invalid JWT', (done) => {
        ExtendedJWT.encode(RsaPrivateCryptoKey, {
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: null }
        }).should.be.rejected.and.notify(done)
      })

      it('should resolve a JWS Compact Serialization', (done) => {
        ExtendedJWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io' },
          serialization: 'compact'
        }).should.eventually.equal(compact).and.notify(done)
      })

      it('should filter unspecified properties', () => {
        return ExtendedJWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io', foo: 'bar' },
          serialization: 'general'
        }).should.eventually.contain('eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0')
      })

      it('should not filter unspecified properties when filter is false', () => {
        return JWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io', foo: 'bar' },
          serialization: 'general',
          filter: false
        }).should.eventually.contain('eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIiwiZm9vIjoiYmFyIn0')
      })
    })

    describe('with Base JWT', () => {
      it('should reject invalid JWT', (done) => {
        JWT.encode(RsaPrivateCryptoKey, {
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: null }
        }).should.be.rejected.and.notify(done)
      })

      it('should resolve a JWS Compact Serialization', (done) => {
        JWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io' },
          serialization: 'compact'
        }).should.eventually.equal(compact).and.notify(done)
      })

      it('should not filter unspecified properties', () => {
        return JWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io', foo: 'bar' },
          serialization: 'general'
        }).should.eventually.contain('eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIiwiZm9vIjoiYmFyIn0')
      })

      it('should filter unspecified properties when filter is true', () => {
        return JWT.encode({
          cryptoKey: RsaPrivateCryptoKey,
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io', foo: 'bar' },
          serialization: 'general',
          filter: true
        }).should.eventually.contain('eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0')
      })
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    it('should reject invalid JWT', (done) => {
      JWT.verify({ cryptoKey: RsaPublicCryptoKey, serialized: 'invalid' })
        .should.be.rejectedWith('Malformed JWT')
        .and.notify(done)
    })

    it('should resolve a boolean', (done) => {
      JWT.verify({ cryptoKey: RsaPublicCryptoKey, serialized: compact })
        .should.eventually.equal(true).and.notify(done)
    })

    it('can resolve an instance', (done) => {
      JWT.verify({ cryptoKey: RsaPublicCryptoKey, serialized: compact, result: 'instance' })
        .should.eventually.be.instanceof(JWT).and.notify(done)
    })
  })
})
