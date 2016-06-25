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
const ECKeyPair = require(path.join(cwd, 'src', 'keys', 'ECKeyPair'))

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

    it('should set the public PEM', () => {
      keypair.pem.pub.should.contain(
        '-----BEGIN PUBLIC KEY-----'
      )
    })

    it('should set the private PEM', () => {
      keypair.pem.prv.should.contain(
        '-----BEGIN EC PRIVATE KEY-----'
      )
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
