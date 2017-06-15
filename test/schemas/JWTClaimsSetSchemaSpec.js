'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()

/**
 * Code under test
 */
const { JWTClaimsSetSchema } = require('../../src/index')
const { JSONSchema } = require('@trust/json-document')

/**
 * Tests
 */
describe('JWTClaimsSetSchema', () => {
  const { properties } = JWTClaimsSetSchema

  it('should be an instance of JSONSchema', () => {
    JWTClaimsSetSchema.should.be.an.instanceof(JSONSchema)
  })

  it('should define "iss" type', () => {
    properties.iss.type.should.equal('string')
  })

  it('should define "iss" format', () => {
    properties.iss.format.should.equal('StringOrURI')
  })

  it('should define "sub" type', () => {
    properties.sub.type.should.equal('string')
  })

  it('should define "sub" format', () => {
    properties.sub.format.should.equal('StringOrURI')
  })

  it('should define "aud" type', () => {
    properties.aud.type.should.eql(['array', 'string'])
  })

  it('should define "aud" format', () => {
    properties.aud.format.should.equal('StringOrURI')
  })

  it('should define "aud" items format', () => {
    properties.aud.items.format.should.equal('StringOrURI')
  })

  it('should define "exp" type', () => {
    properties.exp.type.should.equal('number')
  })

  it('should define "exp" format', () => {
    properties.exp.format.should.equal('NumericDate')
  })

  it('should define "nbf" type', () => {
    properties.nbf.type.should.equal('number')
  })

  it('should define "nbf" format', () => {
    properties.nbf.format.should.equal('NumericDate')
  })

  it('should define "iat" type', () => {
    properties.iat.type.should.equal('number')
  })

  it('should define "iat" format', () => {
    properties.iat.format.should.equal('NumericDate')
  })

  it('should define "jti" type', () => {
    properties.jti.type.should.equal('string')
  })
})

