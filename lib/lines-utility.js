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
}

module.exports = LinesUtility
