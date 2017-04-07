'use strict'

/**
 * Module Dependencies
 * @ignore
 */
const JWT = require('./JWT')
const JWD = require('./JWD')

/**
 * Converter
 */
class Converter {

  /**
   * toJWD
   *
   * @description
   * Convert a JWT to JWD
   *
   * @param  {JWT} data
   * @return {JWD}
   */
  static toJWD (data) {
    return new JWD(data)
  }

  /**
   * toJWT
   *
   * @description
   * Convert a JWD to JWT
   *
   * @param  {JWD} data
   * @return {JWT}
   */
  static toJWT (data) {
    return new JWT(data)
  }

}

/**
 * Export
 * @ignore
 */
module.exports = Converter
