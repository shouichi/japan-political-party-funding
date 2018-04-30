'use strict'

const ONE_NAME_AND_ONE_PRICE = /^(\S+)\s*([\d,?]+)$/

/**
 * LinesFormatter formats a line into identifiable values. This class is
 * typically used for a result of LinesCollector.
 */
class LinesFormatter {
  /**
   */
  constructor() {
  }

  /**
   * @param {string} line Line to format.
   * @return {!Array<string>} Array of identified values.
   */
  async oneNameAndOnePrice(line) {
    const matched = line.match(ONE_NAME_AND_ONE_PRICE)
    if (matched) {
      const price = parseInt(matched[2].split(',').join(''), 10)
      return [matched[1], price]
    } else {
      throw new Error(`Failed to extract one name and one price: ${line}`)
    }
  }
}

module.exports = LinesFormatter
