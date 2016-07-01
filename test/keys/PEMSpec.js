'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const fs = require('fs')
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const PEM = require(path.join(cwd, 'src', 'keys', 'PEM'))
const {PEM_REGEXP} = require(path.join(cwd, 'src', 'jose', 'formats'))

/**
 * Data
 */
const publicKey = fs.readFileSync(
  path.join(cwd, 'test', 'lib', 'public.pem'),
  'ascii'
)

const publicJWK = {
  kty: 'RSA',
  n: 'pZw_uVDIDGMdsIsibYdNpBmrbOMcS06U--Wk3113F04w_lKpl-6UHZRq9Omn8LIKUopbbbQAhLwPtBr_LEx8zwc6cc-aCkkiapZGawstY21NsLYxXJwOwboYJ97Q_vhohSm8MGsbR3pXb9WVBPQivtGXbHfAuLB_h8Sgvy2WJHxqXQbwwPmxXB6AbPEJH7Po1-Hgb0c-bpZqVvlo5bZC7NGv4luT5VbM0mR5dj9vGnM5VQmcDF0sQbXSBA6L-V7EhF5ICnM2S9PMrkELz5osAmaROTaJzFT-3oqak5x-zk1sXKJ3xEG3tU723wHMVM5QokMqdyCT2Du5ZzKEQI4ZEw',
  e: 'AQAB'
}

/**
 * Tests
 */
describe('PEM', () => {

  /**
   * From JWK
   */
  describe('fromJWK', () => {
    it('should return a PEM given a valid JWK object argument', () => {
      PEM.fromJWK(publicJWK)
      .should.match(PEM_REGEXP)
    })

    it('should throw an error with undefined argument', () => {
      expect(() => {
        PEM.fromJWK()
      }).to.throw('undefined is not a valid JWK')
    })

    it('should throw an error with string argument', () => {
      expect(() => {
        PEM.fromJWK('{}')
      }).to.throw('"{}" is not a valid JWK')
    })

    it('should throw an error with empty string argument', () => {
      expect(() => {
        PEM.fromJWK('')
      }).to.throw('"" is not a valid JWK')
    })

    it('should throw an error with number argument', () => {
      expect(() => {
        PEM.fromJWK(1337)
      }).to.throw('1337 is not a valid JWK')
    })

    it('should throw an error with false argument', () => {
      expect(() => {
        PEM.fromJWK(false)
      }).to.throw('false is not a valid JWK')
    })

    it('should throw an error with true argument', () => {
      expect(() => {
        PEM.fromJWK(true)
      }).to.throw('true is not a valid JWK')
    })

    it('should throw an error with null argument', () => {
      expect(() => {
        PEM.fromJWK(null)
      }).to.throw('null is not a valid JWK')
    })

    it('should throw an error with array argument', () => {
      expect(() => {
        PEM.fromJWK([])
      }).to.throw('[] is not a valid JWK')
    })

    it('should throw an error with buffer argument', () => {
      expect(() => {
        PEM.fromJWK(new Buffer('jwk'))
      }).to.throw('{"type":"Buffer","data":[106,119,107]} is not a valid JWK')
    })
  })

  /**
   * To JWK
   */
  describe.only('toJWK', () => {
    it('should return a JWK representation of a PEM', () => {
      PEM.toJWK(publicKey).should.eql(publicJWK)
    })

    it('should throw an error with malformed PEM argument', () => {
      let malformed = publicKey.slice(0, 9)

      expect(() => {
        console.log(PEM.toJWK(malformed))
      }).to.throw(`"${malformed}" is not a valid PEM-encoded key`)
    })
    it('should throw an error with empty string argument', () => {
      expect(() => {
        PEM.toJWK('')
      }).to.throw('"" is not a valid PEM-encoded key')
    })

    it('should throw an error with undefined argument', () => {
      expect(() => {
        PEM.toJWK()
      }).to.throw('undefined is not a valid PEM-encoded key')
    })

    it('should throw an error with null argument', () => {
      expect(() => {
        PEM.toJWK(null)
      }).to.throw('null is not a valid PEM-encoded key')
    })

    it('should throw an error with false argument', () => {
      expect(() => {
        PEM.toJWK(false)
      }).to.throw('false is not a valid PEM-encoded key')
    })

    it('should throw an error with true argument', () => {
      expect(() => {
        PEM.toJWK(true)
      }).to.throw('true is not a valid PEM-encoded key')
    })

    it('should throw an error with object argument', () => {
      expect(() => {
        PEM.toJWK({})
      }).to.throw('{} is not a valid PEM-encoded key')
    })

    it('should throw an error with array argument', () => {
      expect(() => {
        PEM.toJWK([])
      }).to.throw('[] is not a valid PEM-encoded key')
    })

    it('should throw an error with buffer argument', () => {
      expect(() => {
        PEM.toJWK(new Buffer('pem'))
      }).to.throw('{"type":"Buffer","data":[112,101,109]} is not a valid PEM-encoded key')
    })
  })
})
