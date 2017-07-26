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
 * Test data for JWE
 */
const compactJwe = 'eyJhbGciOiJSU0ExXzUiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.UGhIOguC7IuEvf_NPVaXsGMoLOmwvc1GyqlIKOK1nN94nHPoltGRhWhw7Zx0-kFm1NJn8LE9XShH59_i8J0PH5ZZyNfGy2xGdULU7sHNF6Gp2vPLgNZ__deLKxGHZ7PcHALUzoOegEI-8E66jX2E4zyJKx-YxzZIItRzC5hlRirb6Y5Cl_p-ko3YvkkysZIFNPccxRU7qve1WYPxqbb2Yw8kZqa2rMWI5ng8OtvzlV7elprCbuPhcCdZ6XDP0_F8rkXds2vE4X-ncOIM8hAYHHi29NX0mcKiRaD0-D-ljQTP-cFPgwCp6X-nZZd9OHBv-B3oWh2TbqmScqXMR4gp_A.AxY8DCtDaGlsbGljb3RoZQ.KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY.9hH0vgRfYgPnAHOd8stkvw'
const flattenedJwe = '{"protected":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0","unprotected":{"jku":"https://server.example.com/keys.jwks"},"header":{"alg":"A128KW","kid":"7"},"encrypted_key":"6KB707dM9YTIgHtLvtgWQ8mKwboJW3of9locizkDTHzBC2IlrT1oOQ","iv":"AxY8DCtDaGlsbGljb3RoZQ","ciphertext":"KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY","tag":"Mz-VPPyU4RlcuYv1IwIvzw"}'
const jsonJwe = '{"protected":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0","unprotected":{"jku":"https://server.example.com/keys.jwks"},"recipients":[{"header":{"alg":"RSA1_5","kid":"2011-04-29"},"encrypted_key":"UGhIOguC7IuEvf_NPVaXsGMoLOmwvc1GyqlIKOK1nN94nHPoltGRhWhw7Zx0-kFm1NJn8LE9XShH59_i8J0PH5ZZyNfGy2xGdULU7sHNF6Gp2vPLgNZ__deLKxGHZ7PcHALUzoOegEI-8E66jX2E4zyJKx-YxzZIItRzC5hlRirb6Y5Cl_p-ko3YvkkysZIFNPccxRU7qve1WYPxqbb2Yw8kZqa2rMWI5ng8OtvzlV7elprCbuPhcCdZ6XDP0_F8rkXds2vE4X-ncOIM8hAYHHi29NX0mcKiRaD0-D-ljQTP-cFPgwCp6X-nZZd9OHBv-B3oWh2TbqmScqXMR4gp_A"},{"header":{"alg":"A128KW","kid":"7"},"encrypted_key":"6KB707dM9YTIgHtLvtgWQ8mKwboJW3of9locizkDTHzBC2IlrT1oOQ"}],"iv":"AxY8DCtDaGlsbGljb3RoZQ","ciphertext":"KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY","tag":"Mz-VPPyU4RlcuYv1IwIvzw"}'

const ciphertext = "KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY"
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

    describe('JWT JSON Serialization', () => {
      it('should throw malformed JWT', () => {
        expect(() => {
          JWT.decode('{wrong}')
        }).to.throw('Malformed JWT')
      })

      it('should return an instance', () => {
        JWT.decode(json).should.be.instanceof(JWT)
      })

      it('should set JWS type', () => {
        JWT.decode(json).should.have.property('type').that.equals('JWS')
      })

      it('should set JWS payload', () => {
        JWT.decode(json).should.have.property('payload')
          .that.deep.equals({ iss: 'https://forge.anvil.io' })
      })

      it('should set JWS serialization', () => {
        JWT.decode(json).should.have.property('serialization')
          .that.equals('json')
      })

      it('should set JWS signatures', () => {
        JWT.decode(json).should.have.property('signatures')
      })

      describe('signatures', () => {

        it('should set JWS protected header', () => {
          JWT.decode(json).signatures[0].should.have.property('protected')
            .that.deep.equals({ alg: 'RS256', kid: 'r4nd0mbyt3s' })
        })

        it('should set JWS signature', () => {
          JWT.decode(json).signatures[0].should.have.property('signature')
            .that.deep.equals(signature)
        })
      })

      it('should return an instance', () => {
        JWT.decode(jsonJwe).should.be.instanceof(JWT)
      })

      it('should set JWE type', () => {
        JWT.decode(jsonJwe).should.have.property('type').that.equals('JWE')
      })

      it('should set JWE protected header', () => {
        JWT.decode(jsonJwe).should.have.property('protected')
          .that.deep.equals({enc:"A128CBC-HS256"})
      })

      it('should set JWE unprotected header', () => {
        JWT.decode(jsonJwe).should.have.property('unprotected')
          .that.deep.equals({jku:"https://server.example.com/keys.jwks"})
      })

      it('should set JWE iv', () => {
        JWT.decode(jsonJwe).should.have.property('iv')
          .that.deep.equals("AxY8DCtDaGlsbGljb3RoZQ")
      })

      it('should set JWE ciphertext', () => {
        JWT.decode(jsonJwe).should.have.property('ciphertext')
          .that.deep.equals(ciphertext)
      })

      it('should set JWE tag', () => {
        JWT.decode(jsonJwe).should.have.property('tag')
          .that.deep.equals("Mz-VPPyU4RlcuYv1IwIvzw")
      })

      it('should set JWE recipients', () => {
        JWT.decode(jsonJwe).should.have.property('recipients')
      })

      it('should set JWE serialization', () => {
        JWT.decode(jsonJwe).should.have.property('serialization')
          .that.equals('json')
      })

      describe('recipients', () => {

        it('should set JWE protected header', () => {
          JWT.decode(jsonJwe).recipients[1].should.have.property('header')
            .that.deep.equals({"alg":"A128KW","kid":"7"})
        })

        it('should set JWE encrypted key', () => {
          JWT.decode(jsonJwe).recipients[1].should.have.property('encrypted_key')
            .that.deep.equals("6KB707dM9YTIgHtLvtgWQ8mKwboJW3of9locizkDTHzBC2IlrT1oOQ")
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

      it('should return a JWT instance', () => {
        JWT.decode(flattenedJwe).should.be.instanceof(JWT)
      })

      it('should set JWS type', () => {
        JWT.decode(flattened).should.have.property('type').that.equals('JWS')
      })

      it('should set JWE type', () => {
        JWT.decode(flattenedJwe).should.have.property('type').that.equals('JWE')
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

      it('should set JWE protected header', () => {
        JWT.decode(flattenedJwe).should.have.property('protected')
          .that.deep.equals({enc:"A128CBC-HS256"})
      })

      it('should set JWE unprotected header', () => {
        JWT.decode(flattenedJwe).should.have.property('unprotected')
          .that.deep.equals({jku:"https://server.example.com/keys.jwks"})
      })

      it('should set JWE recipient header', () => {
        JWT.decode(flattenedJwe).recipients[0].should.have.property('header')
          .that.deep.equals({"alg":"A128KW","kid":"7"})
      })

      it('should set JWE encrypted key', () => {
        JWT.decode(flattenedJwe).recipients[0].should.have.property('encrypted_key')
          .that.equals("6KB707dM9YTIgHtLvtgWQ8mKwboJW3of9locizkDTHzBC2IlrT1oOQ")
      })

      it('should set JWE iv', () => {
        JWT.decode(flattenedJwe).should.have.property('iv')
          .that.deep.equals("AxY8DCtDaGlsbGljb3RoZQ")
      })

      it('should set JWE ciphertext', () => {
        JWT.decode(flattenedJwe).should.have.property('ciphertext')
          .that.deep.equals(ciphertext)
      })

      it('should set JWE tag', () => {
        JWT.decode(flattenedJwe).should.have.property('tag')
          .that.deep.equals("Mz-VPPyU4RlcuYv1IwIvzw")
      })

      it('should set JWT serialization', () => {
        JWT.decode(flattenedJwe).should.have.property('serialization')
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

      it('should return a JWT instance', () => {
        JWT.decode(compactJwe).should.be.instanceof(JWT)
      })

      it('should set JWS type', () => {
        JWT.decode(compact).should.have.property('type')
          .that.equals('JWS')
      })

      it('should set JWE type', () => {
        JWT.decode(compactJwe).should.have.property('type')
          .that.equals('JWE')
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

      it('should set JWE protected header', () => {
        JWT.decode(compactJwe).should.have.property('protected')
          .that.deep.equals({"alg":"RSA1_5","enc":"A128CBC-HS256"})
      })

      it('should set JWE encrypted key', () => {
        JWT.decode(compactJwe).recipients[0].should.have.property('encrypted_key')
          .that.equals("UGhIOguC7IuEvf_NPVaXsGMoLOmwvc1GyqlIKOK1nN9" +
                        "4nHPoltGRhWhw7Zx0-kFm1NJn8LE9XShH59_i8J0PH5" +
                        "ZZyNfGy2xGdULU7sHNF6Gp2vPLgNZ__deLKxGHZ7Pc" +
                        "HALUzoOegEI-8E66jX2E4zyJKx-YxzZIItRzC5hlRir" +
                        "b6Y5Cl_p-ko3YvkkysZIFNPccxRU7qve1WYPxqbb2Yw" +
                        "8kZqa2rMWI5ng8OtvzlV7elprCbuPhcCdZ6XDP0_F8r" +
                        "kXds2vE4X-ncOIM8hAYHHi29NX0mcKiRaD0-D-ljQTP" +
                        "-cFPgwCp6X-nZZd9OHBv-B3oWh2TbqmScqXMR4gp_A")
      })

      it('should set JWE iv', () => {
        JWT.decode(compactJwe).should.have.property('iv')
          .that.deep.equals("AxY8DCtDaGlsbGljb3RoZQ")
      })

      it('should set JWE ciphertext', () => {
        JWT.decode(compactJwe).should.have.property('ciphertext')
          .that.deep.equals(ciphertext)
      })

      it('should set JWE tag', () => {
        JWT.decode(compactJwe).should.have.property('tag')
          .that.deep.equals("9hH0vgRfYgPnAHOd8stkvw")
      })

      it('should set JWT serialization', () => {
        JWT.decode(compactJwe).should.have.property('serialization')
          .that.equals('compact')
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

    // this is not always the case as the alg header
    // must be checked to determine the alg type:
    // signature/MAC or encryption
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

      it.skip('should resolve a JWE Compact Serialization', (done) => {
        ExtendedJWT.encode({
          serialization: 'compact'
        }).should.eventually.equal(compactJwe).and.notify(done)
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

  /**
   * compact serialization
   */
   describe('toCompact', () => {
     it('should serialize compact JWS', () => {
       JWT.decode(compact).toCompact().should.equal(compact)
     })

     it('should serialize compact JWE', () => {
       JWT.decode(compactJwe).toCompact().should.equal(compactJwe)
     })
   })

  /**
   * flattened serialization
   */
   describe('toFlattened', () => {
     it('should serialize flattened JWS', () => {
       JWT.decode(flattened).toFlattened().should.equal(flattened)
     })

     it('should serialize flattened JWE', () => {
       JWT.decode(flattenedJwe).toFlattened().should.equal(flattenedJwe)
     })
   })

  /**
   * general JSON serialization
   */
   describe('toGeneral', () => {
     it('should serialize JWS', () => {
       JWT.decode(json).toGeneral().should.equal(json)
     })

     it('should serialize JWE', () => {
       JWT.decode(jsonJwe).toGeneral().should.equal(jsonJwe)
     })
   })
})
