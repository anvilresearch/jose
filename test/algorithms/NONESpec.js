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
const None = require('../../src/algorithms/NONE')

describe('None', () => {
  const none = new None({})

  describe('sign', () => {
    it('should resolve with empty string', () => {
      return none.sign()
        .then(result => {
          expect(result).to.equal('')
        })
    })
  })
})
