'use strict'

class MapUtility {
  /**
   */
  construct() {
  }

  /**
   * Converts a Map object to an Object object. It assumes that keys used in the
   * Map object are string, and it actually calls toString method on each key
   * to convert them into string.
   *
   * @param {!Map} map Map object to convert.
   * @return {!Object} Converted Object object.
   */
  async toObject(map) {
    const result = Object.create(null)

    for (const entry of map) {
      const key = entry[0].toString()
      const value = entry[1]

      if (value instanceof Map) {
        result[key] = await this.toObject(value)
      } else {
        result[key] = value
      }
    }

    return result
  }
}

module.exports = MapUtility
