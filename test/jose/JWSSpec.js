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
const JWS = require('../../src/jose/JWS')
const {DataError} = require('../../src/errors')

/**
 * RSA Key Pair
 */
const RsaPrivateJwk = {
  kty: 'RSA',
  n: 'iEJoO1tBT1Yc9jdYWI5JUkMnOlFD-weoi1rkxsWvZoBRJJGifjrdmIn_5xOaaW38Cg535lo6NEorsVsq7V6zGan2QCT1TRCb7vJq4UIEq6tL5uB0BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZFC3HgDvrqb_4bDIbO0-sAiaTumt-2uyIYcGYBuIfTi8vmElz2ngUFh-8K_uQyH7YjrOrg6ThOldh8IVzaOSA7LAb_DjyC-H44F_J24qMRLGuWK53gz-2RazSBotiNUsGoxdZv30Sud3Yfbz9ZjSXxPWpRnG6mZAZW76oSbn8FvTSTWrf0iU6MyNkv_QuAjF-1BQ',
  e: 'AQAB',
  d: 'dvcbz-8Np3n00Vdi7_ZSt9rfrf_zzYFTO1BBe_Zu_Jw9vCLW70Tv4lViMtsfrrsTGaimMF1Iggzb9v41DYfn8Rk-YaSi8wT0T_whKsicEVH-c_Y19gQc4rPSpy2ilJhBn9w_lkC_sko83DNE1ntpbuOejxWth9ggv6AXhligYIt0h3DasVqhtkUa1RDUBKm4EhLc0BCPFAtN2XONRcKqoTTZUpVboKGv9k8OeyMOZXFmNjn68uhlHJLiNYFHrh-BWsD4WgIWq1sqHldkIZRJGEZizTpcuWeMuf3V-2A7oOLcVtDZ3iesxGQPxyI4-_WJqjjb3ApOGIKFOB7QNEXlIQ',
  p: 'vblqHOYDjdRTPV2rumoWKPzREhebi0ljKeMBFPvqVBM_IvOhqpVacBsDCNGHwkOo3lX-M-c8y381ZR66pJb5QpF7qfIjlOQEYQfLc31HErYcHiPtKSNjL4HP5kAoZT4ILFZlfnVJP8oZ_S-BKO27juMwDVUk_wlI2CiN0a1oPWk',
  q: 't9vB-yjoWydrBXy5q4m0pMcTm9FZum9kahCXx_0QjYPLjxwX6-d8Tc1Y1_VROtQDAIxuyMZxkboQ0L8uXtVQCjVz8hG1UDeqzISxLyTVP-JtD6yijhyrtQdgtokgAFzBHpYaMKgr8tARtojF5EyWPTQJpBSI2-tl0GgwEOa3Gz0',
  dp: 'euUkC1wjaTfkQ5ftqW8Ws64wb5vDMdJz3aoiBUm5XISrHSTbz_e3AW894_R2ECxrsrnZVB2xj8_y8nGZTQxOogRDKq6ixct92qyF6WV5KHG2fP-gnElD8n4QAYIFqK8p9C5yyBuJOzza4Npou-5i1AfuFHTW5i1JdluuoefF4iE',
  dq: 'MbqQxxwTbMRGoB9SIOGIKKFn3ldLi6-hW0bNptv95Cjnn_ebSMU9y9Vk2FST-fNqNHXHaSqzgRTwg2WSZzgPBBPdHnZHskC8Q8EII5Y0z6iwkvLArOt4TeiG8hg4vaBY46r5vnteF7jLcbGgxNUqNbeje-vJ8KHE0g-8IHYmxIk',
  qi: 'lXeBzCAWAADq3ybuDhhK0MoA0meC2118dkLUiEYU60o9z-ud6huAMK3jyDD1tAPyDLzuVpFv-GOb_QDPhuO0MM6QpjnKEJS2KmenHgVHXacZGYx9EZ50smGut2WSeLznfu9SXavCIbdTctOL28cwhsFB6TmvGVtzyNLx6MZQV1w'
}

const RsaPublicJwk = {
  kty: 'RSA',
  n: 'iEJoO1tBT1Yc9jdYWI5JUkMnOlFD-weoi1rkxsWvZoBRJJGifjrdmIn_5xOaaW38Cg535lo6NEorsVsq7V6zGan2QCT1TRCb7vJq4UIEq6tL5uB0BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZFC3HgDvrqb_4bDIbO0-sAiaTumt-2uyIYcGYBuIfTi8vmElz2ngUFh-8K_uQyH7YjrOrg6ThOldh8IVzaOSA7LAb_DjyC-H44F_J24qMRLGuWK53gz-2RazSBotiNUsGoxdZv30Sud3Yfbz9ZjSXxPWpRnG6mZAZW76oSbn8FvTSTWrf0iU6MyNkv_QuAjF-1BQ',
  e: 'AQAB'
}

/**
 * Tests
 */
describe('JWS', () => {
  let importedRsaPrivateKey, importedRsaPublicKey

  before(() => {
    let alg = { name: 'RSASSA-PKCS1-v1_5' }

    return Promise.all([
      crypto.subtle.importKey('jwk', RsaPrivateJwk, alg, true, ['sign']),
      crypto.subtle.importKey('jwk', RsaPublicJwk, alg, true, ['verify'])
    ])
    .then(cryptoKeys => {
      importedRsaPrivateKey = cryptoKeys[0]
      importedRsaPublicKey = cryptoKeys[1]
    })
  })

  /**
   * sign
   */
  describe('sign', () => {
    describe('Compact Serialization', () => {
      let token, compact

      before(() => {
        token = {
          serialization: 'compact',
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io' },
          key: importedRsaPrivateKey
        }

        compact = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0.eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0.FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'
      })

      it('should return a promise', () => {
        return JWS.sign(token).should.be.fulfilled
      })

      it('should resolve a signed JWT', () => {
        return JWS.sign(token).should.eventually.equal(compact)
      })
    })

    describe('JSON Serialization', () => {
      it('should return a promise')
      it('should resolve a string')
      it('should resolve a signed JWT')
    })

    describe('Flattened JSON Serialization', () => {
      it('should return a promise')
      it('should resolve a string')
      it('should resolve a signed JWT')
    })

    describe('Unsupported Serialization', () => {
      let token

      before(() => {
        token = {
          serialization: 'unsupported',
          header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
          payload: { iss: 'https://forge.anvil.io' },
          key: importedRsaPrivateKey
        }
      })

      it('should return a promise', () => {
        return JWS.sign(token).should.be.rejected
      })

      it('should reject a DataError', () => {
        return JWS.sign(token).should.be.rejectedWith(DataError)
      })
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    describe('Compact Serialization', () => {
      let jwt, signature

      before(() => {
        signature = 'FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'
        jwt = {
          header: { alg: 'RS256' },
          signature,
          segments: [
            'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0',
            'eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0',
            signature
          ],
          key: importedRsaPublicKey
        }
      })

      it('should return a promise', () => {
        return JWS.verify(jwt).should.be.fulfilled
      })

      it('should resolve a boolean', () => {
        return JWS.verify(jwt).should.eventually.equal(true)
      })

      it('should set JWT verified property', () => {
        return JWS.verify(jwt).then(verified => {
          jwt.verified.should.equal(true)
        })
      })
    })

    describe('multiple signature serialization', () => {
      it('should return a promise')
      it('should resolve the JWT')
      it('should set JWT verified property')
    })

    describe('missing signature(s)', () => {
      let jwt

      before(() => {
        jwt = {
          header: { alg: 'RS256' },
          key: importedRsaPublicKey
        }
      })

      it('should return a promise', () => {
        return JWS.verify(jwt).should.be.rejected
      })

      it('should reject a DataError', () => {
        return JWS.verify(jwt).should.be.rejectedWith(DataError)
      })
    })
  })
})
