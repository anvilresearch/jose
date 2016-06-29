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
const BaseAlgorithm = require(
  path.join(cwd, 'src', 'jose', 'algs', 'BaseAlgorithm')
)

/**
 * Tests
 */
describe('BaseAlgorithm', () => {
  describe('constructor', () => {})
  describe('sign', () => {})
  describe('verify', () => {})
  describe('encrypt', () => {})
  describe('decrypt', () => {})
  describe('toPEM', () => {})
})
