'use strict'

/**
 * Dependencies
 * @ignore
 */
const BaseAlgorithm = require('./BaseAlgorithm')

/**
 * "none" Algorithm
 */
class None extends BaseAlgorithm {
  sign () {
    return ''
  }
}

/**
 * Export
 */
module.exports = None
