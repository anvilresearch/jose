'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const PEM = require('../../src/keys/PEM')
const {PEM_REGEXP} = require('../../src/formats')

/**
 * Test PEM
 */
//const privateKey = fs.readFileSync(
//  path.join(cwd, 'test', 'lib', 'private.pem'),
//  'ascii'
//)
//const publicKey = fs.readFileSync(
//  path.join(cwd, 'test', 'lib', 'public.pem'),
//  'ascii'
//)

/**
 * Test JWK
 */
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
  describe('toJWK', () => {
    it('should return a JWK representation of a PEM')
    //it('should return a JWK representation of a PEM', () => {
    //  PEM.toJWK(publicKey).should.eql(publicJWK)
    //})

    it('should throw an error with malformed PEM argument')
    //it('should throw an error with malformed PEM argument', () => {
    //  let malformed = publicKey.slice(0, 9)

    //  expect(() => {
    //    console.log(PEM.toJWK(malformed))
    //  }).to.throw(`"${malformed}" is not a valid PEM-encoded key`)
    //})

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

  /**
   * Is PEM
   */
  describe('isPEM', () => {
    describe('with a single argument', () => {
      it('should return true with a valid PEM formatted string')
      //it('should return true with a valid PEM formatted string', () => {
      //  PEM.isPEM(publicKey).should.be.true
      //})

      it('should return false with malformed PEM argument')
      //it('should return false with malformed PEM argument', () => {
      //  PEM.isPEM(publicKey.slice(0, publicKey.length - 2)).should.be.false
      //})

      it('should return false with undefined argument', () => {
        PEM.isPEM().should.be.false
      })

      it('should return false with null argument', () => {
        PEM.isPEM(null).should.be.false
      })

      it('should return false with empty string argument', () => {
        PEM.isPEM('').should.be.false
      })

      it('should return false with number argument', () => {
        PEM.isPEM(5150).should.be.false
      })

      it('should return false with false argument', () => {
        PEM.isPEM(false).should.be.false
      })

      it('should return false with true argument', () => {
        PEM.isPEM(true).should.be.false
      })

      it('should return false with object argument', () => {
        PEM.isPEM({}).should.be.false
      })

      it('should return false with array argument', () => {
        PEM.isPEM([]).should.be.false
      })

      it('should return false with buffer argument', () => {
        PEM.isPEM(new Buffer('no')).should.be.false
      })
    })

    describe('with optional algorithm argument', () => {
      it('should return true with a valid PEM and no encoded algorithm')
      //it('should return true with a valid PEM and no encoded algorithm', () => {
      //  PEM.isPEM(publicKey, 'RSA').should.be.true
      //})

      it('should return true with a valid PEM and matching algorithm')
      //it('should return true with a valid PEM and matching algorithm', () => {
      //  PEM.isPEM(privateKey, 'RSA').should.be.true
      //})

      it('should return false with a valid PEM and mismatching algorithm')
      //it('should return false with a valid PEM and mismatching algorithm', () => {
      //  PEM.isPEM(privateKey, 'EC').should.be.false
      //})
    })

    describe('with optional type argument', () => {
      it('should return true with matching type')
      //it('should return true with matching type', () => {
      //  PEM.isPEM(publicKey, 'RSA', 'PUBLIC').should.be.true
      //})

      it('should return true with mismatching type')
      //it('should return true with mismatching type', () => {
      //  PEM.isPEM(publicKey, 'RSA', 'PRIVATE').should.be.false
      //})
    })
  })
})
