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
      descriptor = {

      }

      promise = KeyChain.generate(descriptor).then(result => {
        keys = result
        done()
      })
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve an instance of KeyChain', () => {
      keys.should.be.instanceof(KeyChain)
    })
  })

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
      console.log(keys)
      keys.a.b.type.should.equal('RSA')
      keys.a.c.d.type.should.equal('RSA')
      keys.e.type.should.equal('RSA')
      keys.f.g.h.i.type.should.equal('RSA')
    })

    it('should cast a leaf object to RSAKeyPair instance', () => {
      let data = {
        a: { b: { type: 'RSA', jwk: {}, pem: {} } }
      }

      let keys = new KeyChain(data)
      keys.a.b.should.be.instanceof(RSAKeyPair)
    })

    it('should cast a leaf object to ECKeyPair instance', () => {
      let data = {
        a: { b: { type: 'EC', jwk: {}, pem: {} } }
      }

      let keys = new KeyChain(data)
      keys.a.b.should.be.instanceof(ECKeyPair)
    })

    it('should cast a leaf object to SymmetricKey instance')

  })
})
