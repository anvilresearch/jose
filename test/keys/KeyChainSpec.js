'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

/**
 * Assertions
 */
chai.use(sinonChai)
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const KeyChain = require(path.join(cwd, 'src', 'keys', 'KeyChain'))
const RSAKeyPair = require(path.join(cwd, 'src', 'keys', 'RSAKeyPair'))
const ECKeyPair = require(path.join(cwd, 'src', 'keys', 'ECKeyPair'))

/**
 * Tests
 */
describe('KeyChain', () => {

  /**
   * Generate
   */
  describe('generate', () => {
    let descriptor, promise, keys

    before((done) => {
      sinon.stub(KeyChain, 'generateRSAKeyPair')
        .returns(Promise.resolve(new RSAKeyPair))

      sinon.stub(KeyChain, 'generateECKeyPair')
        .returns(Promise.resolve(new ECKeyPair))

      descriptor = {
        a: {
          b: 'RSAKeyPair',
          c: 'RSAKeyPair'
        },
        d: {
          e: 'ECKeyPair',
          f: 'ECKeyPair'
        }
      }

      promise = KeyChain.generate(descriptor).then(result => {
        keys = result
        done()
      })
    })

    after(() => {
      KeyChain.generateRSAKeyPair.restore()
      KeyChain.generateECKeyPair.restore()
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve an instance of KeyChain', () => {
      keys.should.be.instanceof(KeyChain)
    })

    it('should generate RSAKeyPairs', () => {
      keys.a.b.should.be.instanceof(RSAKeyPair)
      keys.a.c.should.be.instanceof(RSAKeyPair)
    })

    it('should generate ECKeyPairs', () => {
      keys.d.e.should.be.instanceof(ECKeyPair)
      keys.d.f.should.be.instanceof(ECKeyPair)
    })
  })

  /**
   * Generate RSAKeyPair
   */
  describe('generateRSAKeyPair', () => {
    let promise

    before(() => {
      sinon.stub(RSAKeyPair, 'generate').returns(Promise.resolve())
      promise = KeyChain.generateRSAKeyPair()
    })

    after(() => {
      RSAKeyPair.generate.restore()
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should generate an RSAKeyPair', () => {
      RSAKeyPair.generate.should.have.been.called
    })
  })

  /**
   * Generate ECKeyPair
   */
  describe('generateECKeyPair', () => {
    let promise

    before(() => {
      sinon.stub(ECKeyPair, 'generate').returns(Promise.resolve())
      promise = KeyChain.generateECKeyPair()
    })

    after(() => {
      ECKeyPair.generate.restore()
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should generate an ECKeyPair', () => {
      ECKeyPair.generate.should.have.been.called
    })
  })

  /**
   * Constructor
   */
  describe('constructor', () => {
    it('should deep copy an object argument', () => {
      let data = {
        a: {
          b: {
            type: 'RSA'
          },
          c: {
            d: {
              type: 'RSA'
            }
          }
        },
        e: {
          type: 'RSA'
        },
        f: {
          g: {
            h: {
              i: {
                type: 'RSA'
              }
            }
          }
        }
      }

      let keys = new KeyChain(data)
      keys.a.b.type.should.equal('RSA')
      keys.a.c.d.type.should.equal('RSA')
      keys.e.type.should.equal('RSA')
      keys.f.g.h.i.type.should.equal('RSA')
    })

    //it('should cast a leaf object to RSAKeyPair instance', () => {
    //  let data = {
    //    a: { b: { type: 'RSA', jwk: {}, pem: {} } }
    //  }

    //  let keys = new KeyChain(data)
    //  keys.a.b.should.be.instanceof(RSAKeyPair)
    //})

    //it('should cast a leaf object to ECKeyPair instance', () => {
    //  let data = {
    //    a: { b: { type: 'EC', jwk: {}, pem: {} } }
    //  }

    //  let keys = new KeyChain(data)
    //  keys.a.b.should.be.instanceof(ECKeyPair)
    //})

    //it('should cast a leaf object to SymmetricKey instance')

  })
})
