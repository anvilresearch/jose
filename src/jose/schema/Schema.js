'use strict'

/**
 * Dependencies
 * @ignore
 */
const Initializer = require('./Initializer')
const Validator = require('./Validator')

/**
 * Schema
 */
class Schema {

  /**
   * Constructor
   */
  constructor (descriptor) {
    Object.assign(this, descriptor)
    Object.defineProperties({
      initialize: {
        enumerable: false,
        value: Initializer.compile(descriptor)
      },
      validate: {
        enumerable: false,
        value: Validator.compile(descriptor)
      }
    })
  }
}

/**
 * Export
 */
module.exports = Schema
