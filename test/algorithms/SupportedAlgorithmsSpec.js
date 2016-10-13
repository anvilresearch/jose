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
const SupportedAlgorithms = require('../../src/algorithms/SupportedAlgorithms')

/**
 * Tests
 */
describe('SupportedAlgorithms', () => {
  describe('constructor', () => {
    it('should initialize registers')
  })

  describe('static get operations', () => {
    it('should be an array of operations')
  })

  describe('define', () => {
    it('should register an algorithm for an operation')
  })

  describe('normalize', () => {
    it('should return a registered algorithm for an operation by name')
    it('should throw NotSupportedError for unknown algorithms')
  })
})

