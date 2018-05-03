'use strict'

const LinesUtility = require('./lines-utility')

const ONE_NAME_AND_ONE_PRICE = /^(\S+)\s*([\d,?]+)$/

/**
 * LinesFormatter formats a line into identifiable values. This class is
 * typically used for a result of LinesCollector.
 */
class LinesFormatter {
  /**
   */
  constructor() {
    this.linesUtility = new LinesUtility()
  }

  /**
   * @param {string} line Line to format.
   * @return {!Array<string>} Array of identified values.
   */
  async oneNameAndOnePrice(line) {
    const matched = line.match(ONE_NAME_AND_ONE_PRICE)
    if (matched) {
      const price = await this.linesUtility.parsePrice(matched[2])
      return [matched[1], price]
    } else {
      throw new Error(`Failed to extract one name and one price: ${line}`)
    }
  }

  /**
   * @param {string} line Line to format.
   * @return {!Array<string>} Array of identified values.
   */
  async donation(line) {
    const segments = line.split(/\s/)

    const result = []
    // first name + space(optional) + last name + price + place
    if (segments.length >= 3) {
      const place = segments.pop()
      const price = await this.linesUtility.parsePrice(segments.pop())
      let death = segments[0] === '遺' ? segments.shift() : null

      result.push(death, segments.join(''), price, place)
    } else if (segments.length === 1) {
      const matched = segments[0].match(/^(\D+)([\d,?]+)/)
      const price = await this.linesUtility.parsePrice(matched[2])
      result.push(null, matched[1], price, null)
    } else {
      throw new Error(`Failed to format a donation line: ${line}`)
    }

    return result
  }

  /**
   * @param {string} line Line to format.
   * @return {!Array<string>} Array of identified values.
   */
  async space(line) {
    const segments = line.split(/\s/)

    try {
      const name = segments[0]
      const price = await this.linesUtility.parsePrice(segments[1])
      const space = parseFloat(segments[2].replace(',', ''))
      const era = segments[3]
      const date = segments[4]

      return [name, price, space, era, date]
    } catch (error) {
      throw error
    }
  }
}

module.exports = LinesFormatter
