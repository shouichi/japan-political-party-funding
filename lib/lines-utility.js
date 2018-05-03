'use strict'

/**
 * LinesUtility provides a set of funtionality that makes it easy to deal with
 * a text extracted from Kanpou Seijishikin Report.
 */
class LinesUtility {
  /**
   */
  constructor() {
  }

  /**
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareOneNameAndOnePrice(line) {
    const price = []
    const name = []

    const trimmed = line.trim()
    for (let index = trimmed.length - 1; index >=0; index--) {
      const character = trimmed[index]

      if (character.match(/^\d|,/)) {
        price.push(character)
      } else if (character.match(/^\s/)) {
        if (name.length > 0) {
          break
        }
      } else {
        name.push(character)
      }
    }

    return `${name.reverse().join('')} ${price.reverse().join('')}`
  }

  /**
   * Prepares a donation line. Note that this method only takes care of very
   * special cases where they need some re-formatting.
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareDonation(line) {
    const segments = line.split(/\s/)
    // take care of situation like: 'グローバルサイン㈱105,000 渋谷区'
    if (segments.length === 2 && segments[1].match(/\D/)) {
      const price = []
      let name = ''

      for (let index = segments[0].length - 1; index >= 0; index--) {
        const character = segments[0].charAt(index)
        if (character.match(/\d|,/)) {
          price.push(character)
        } else {
          name = segments[0].substring(0, index + 1)
          break
        }
      }

      return `${name} ${price.reverse().join('')} ${segments[1]}`
    } else {
      return line
    }
  }

  /**
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async parsePrice(line) {
    try {
      return parseInt(line.split(',').join(''), 10)
    } catch (error) {
      throw error
    }
  }
}

module.exports = LinesUtility
