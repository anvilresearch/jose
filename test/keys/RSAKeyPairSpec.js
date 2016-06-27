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
const RSAKeyPair = require(path.join(cwd, 'src', 'keys', 'RSAKeyPair'))

/**
 * Tests
 */
describe('RSAKeyPair', () => {

  /**
   * Generate
   */
  describe('generate', () => {
    let promise, keypair

    before((done) => {
      // short keylength so the tests done lag
      promise = RSAKeyPair.generate({ bitlength: 1024 }).then(result => {
        keypair = result
        done()
      })
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve an instance of ECKeyPair', () => {
      keypair.should.be.instanceof(RSAKeyPair)
    })

    it('should set the public PEM', () => {
      keypair.pem.pub.should.contain(
        '-----BEGIN PUBLIC KEY-----'
      )
    })

    it('should set the private PEM', () => {
      keypair.pem.prv.should.contain(
        '-----BEGIN RSA PRIVATE KEY-----'
      )
    })
  })

  /**
   * Constructor
   */
  describe('constructor', () => {
    it('should throw an error if "type" is not "RSA"', () => {
      expect(() => {
        new RSAKeyPair({ type: 'EC' })
      }).to.throw('RSAKeyPair data must have the type "RSA"')
    })

    it('should set "type" to "RSA" if undefined by argument', () => {
      let keypair = new RSAKeyPair()
      keypair.type.should.equal('RSA')
    })
  })
})
