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
const JWKSet = require(path.join(cwd, 'src', 'jose', 'JWKSet'))

/**
 * Tests
 */
describe('JWKSet', () => {
  describe('schema', () => {
    let {schema: {properties}} = JWKSet


    /**
     * 5.  JWK Set Format
     * https://tools.ietf.org/html/rfc7517#section-5
     *
     *   A JWK Set is a JSON object that represents a set of JWKs.  The JSON
     *   object MUST have a "keys" member, with its value being an array of
     *   JWKs.  This JSON object MAY contain whitespace and/or line breaks.
     *
     *   The member names within a JWK Set MUST be unique; JWK Set parsers
     *   MUST either reject JWK Sets with duplicate member names or use a JSON
     *   parser that returns only the lexically last duplicate member name, as
     *   specified in Section 15.12 ("The JSON Object") of ECMAScript 5.1
     *   [ECMAScript].
     *
     *   Additional members can be present in the JWK Set; if not understood
     *   by implementations encountering them, they MUST be ignored.
     *   Parameters for representing additional properties of JWK Sets should
     *   either be registered in the IANA "JSON Web Key Set Parameters"
     *   registry established by Section 8.4 or be a value that contains a
     *   Collision-Resistant Name.
     *
     *   Implementations SHOULD ignore JWKs within a JWK Set that use "kty"
     *   (key type) values that are not understood by them, that are missing
     *   required members, or for which values are out of the supported
     *   ranges.
     */

    /**
     * 5.1.  "keys" Parameter
     *
     *   The value of the "keys" parameter is an array of JWK values.  By
     *   default, the order of the JWK values within the array does not imply
     *   an order of preference among them, although applications of JWK Sets
     *   can choose to assign a meaning to the order for their purposes, if
     *   desired.
     *
     */

    it('should define type of "keys"', () => {
      properties.keys.type.should.equal('array')
    })

    it('should define schemas of array elements')

  })
})
