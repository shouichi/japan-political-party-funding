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
      let nameAndPrice
      try {
        nameAndPrice = await this.extractTailingNameAndPrice(segments[0])
      } catch (error) {
        throw error
      }

      return `${nameAndPrice.name} ${nameAndPrice.price} ${segments[1]}`
    } else {
      return line
    }
  }

  /**
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareSpace(line) {
    let dates
    try {
      dates = await this.extractTailingDate(line)
    } catch (error) {
      throw error
    }

    const segments = dates.rest.split(/\s/)
    const name = segments[0]
    let priceAndSpace = segments[1]
    if (segments.length > 2) {
      priceAndSpace += segments[2]
    }

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

    return `${name} ${price} ${space} ${dates.era} ${dates.date}`
  }

  /**
   * Note that a movable property can possibly include era info as well, but
   * I'm not accounting for that case since it's unlikely at the moment (a
   * movable property from 昭和 is highly unlikely).
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareMovableProperty(line) {
    let dates
    try {
      dates = await this.extractTailingDate(line)
    } catch (error) {
      throw error
    }

    let nameAndPrice
    try {
      nameAndPrice = await this.extractTailingNameAndPrice(dates.rest)
    } catch (error) {
      throw error
    }

    return `${nameAndPrice.name} ${nameAndPrice.price} ` +
        `${dates.era} ${dates.date}`
  }

  /**
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareSecurityDeposit(line) {
    try {
      return await this.prepareMovableProperty(line)
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {string} line Line to prepare.
   * @return {string} Line prepared.
   */
  async prepareDebt(line) {
    try {
      const nameAndPrice = await this.extractTailingNameAndPrice(line)
      return `${nameAndPrice.name} ${nameAndPrice.price}`
    } catch (error) {
      throw error
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

  /**
   * @private
   */
  async extractTailingDate(line) {
    const date = line.substr(line.length - 8, 8)
    let rest = line.substring(0, line.length - 8)

    // format date
    const dates = date.split('.')
    const formattedDate =
        sprintf('%1$02d.%2$02d.%3$02d', dates[0], dates[1], dates[2])

    // check if the line contains the era
    let cleanedRest = rest.trim()
    let era = cleanedRest.substr(cleanedRest.length - 2, 2)
    if (era.match(/^[^0-9.]{2}/)) {
      cleanedRest = cleanedRest.substr(0, cleanedRest.length - 2)
    } else {
      // default is 平成
      era = '平成'
    }

    return { date: formattedDate, era: era, rest: cleanedRest }
  }

  /**
   * @private
   */
  async extractTailingNameAndPrice(line) {
    let name
    let price

    const cleanedLine = line.trim()
    for (let index = cleanedLine.length - 1; index >= 0; index--) {
      const character = cleanedLine.charAt(index)
      if (!character.match(/\d|,/)) {
        name = cleanedLine.substr(0, index + 1).split(/\s/).join('').trim()
        price = cleanedLine.substr(index + 1).trim()
        break
      }
    }

    return { name, price }
  }
}

module.exports = LinesUtility
