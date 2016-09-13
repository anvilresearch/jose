/**
 * Package dependencies
 */
const {JSONDocument} = require('json-document')
const {JOSEHeaderSchema} = require('../schemas')

/**
 * Header
 */
class JOSEHeader extends JSONDocument {

  /**
   * schema
   */
  static get schema () {
    return JOSEHeaderSchema
  }

  /**
   * isJWS
   */
  isJWS () {}

  /**
   * isJWE
   */
  isJWE () {}

}

/**
 * Export
 */
module.exports = JOSEHeader
