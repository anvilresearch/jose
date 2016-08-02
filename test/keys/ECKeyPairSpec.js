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
const ECKeyPair = require('../../src/keys/ECKeyPair')
const ECPublicKey = require('../../src/keys/ECPublicKey')
const ECPrivateKey = require('../../src/keys/ECPrivateKey')

/**
 * Tests
 */
describe('ECKeyPair', () => {

  /**
   * Generate
   */
  describe('generate', () => {
    let promise, keypair

    before((done) => {
      promise = ECKeyPair.generate().then(result => {
        keypair = result
        done()
      })
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve an instance of ECKeyPair', () => {
      keypair.should.be.instanceof(ECKeyPair)
    })

    it('should set the public JWK', () => {
      keypair.pub.should.be.an.instanceof(ECPublicKey)
    })

    it('should set the private JWK', () => {
      keypair.prv.should.be.an.instanceof(ECPrivateKey)
    })
  })

  /**
   * Constructor
   */
  describe('constructor', () => {
    it('should throw an error if "type" is not "EC"', () => {
      expect(() => {
        new ECKeyPair({ type: 'RSA' })
      }).to.throw('ECKeyPair data must have the type "EC"')
    })

    it('should set "type" to "EC" if undefined by argument', () => {
      let keypair = new ECKeyPair()
      keypair.type.should.equal('EC')
    })
  })
})
