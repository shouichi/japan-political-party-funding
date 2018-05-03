'use strict'

const sprintf = require('sprintf-js').sprintf

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
  async prepareSpace(line) {
    const date = line.substr(line.length - 8, 8)
    let rest = line.substring(0, line.length - 8)

    // format date
    const dates = date.split('.')
    const formattedDate =
        sprintf('%1$02d.%2$02d.%3$02d', dates[0], dates[1], dates[2])

    // check if the line contains the era
    let era = rest.substr(rest.length - 2, 2)
    if (era.match(/^\D/)) {
      rest = rest.substr(0, rest.length - 2)
    } else {
      // default is 平成
      era = '平成'
    }

    const segments = rest.split(/\s/)
    const name = segments[0]
    const priceAndSpace = segments[1]

    // find where to split price and space
    let price = null
    let space = null
    // set it to some large number in the beginning
    let howManyToGo = 100
    for (let index = 0; index < priceAndSpace.length; index++) {
      const character = priceAndSpace.charAt(index)

      if (character === ',') {
        howManyToGo = 4
      }
      if (howManyToGo <= 0) {
        price = priceAndSpace.substr(0, index)
        space = priceAndSpace.substr(index)
        break
      }

      howManyToGo -= 1
    }

    return `${name} ${price} ${space} ${era} ${formattedDate}`
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
