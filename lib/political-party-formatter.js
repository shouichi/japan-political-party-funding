'use strict'

const LinesCollector = require('./lines-collector')
const LinesFormatter = require('./lines-formatter')
const LinesSplitter = require('./lines-splitter')

const KOMEITO = '公明党'
const SOCIAL_DEMOCRATIC_PARTY = '社会民主党'

const TOTAL_REVENUE = '収入総額'

const POLITICAL_PARTIES = [
  { name: KOMEITO, regex: /^公明党/ },
  { name: SOCIAL_DEMOCRATIC_PARTY, regex: /^社会民主党/ },
]
const CATEGORIES = [
  { name: TOTAL_REVENUE, regex: /^\s*収入総額/ },
  { name: 'totalSpending', regex: /^\s*支出総額/ },
  { name: 'revenueBreakdown', regex: /^\s*本年収入の内訳/ },
  { name: 'spendingBreakdown', regex: /^\s*支出の内訳/ },
  { name: 'spendingBreakdown', regex: /^\s*支出の内訳/ },
  { name: 'donationBreakdown', regex: /^\s*寄附の内訳/ },
  { name: 'assetBreakdown', regex: /^\s*資産等の内訳/ },
]

/**
 */
class PoliticalPartyFormatter {
  /**
   * @param {!Array<string>} lines Lines of text to format.
   */
  constructor(lines) {
    this.lines = lines.slice()

    this.linesCollector = new LinesCollector()
    this.linesFormatter = new LinesFormatter()
  }

  /**
   * @return {string} KOMEITO
   */
  static get KOMEITO() {
    return KOMEITO
  }

  /**
   * @return {string} SOCIAL_DEMOCRATIC_PARTY
   */
  static get SOCIAL_DEMOCRATIC_PARTY() {
    return SOCIAL_DEMOCRATIC_PARTY
  }

  /**
   * @return {string} TOTAL_REVENUE
   */
  static get TOTAL_REVENUE() {
    return TOTAL_REVENUE
  }

  /**
   */
  async format() {
    let result = await this.splitByPoliticalParty()
    await this.splitByCategory(result)
    await this.formatTotalRevenue(result)

    return result
  }

  /**
   * @private
   * @return {!Map} Map object containing lines of text for each political
   *     party that is also keyed by political party name.
   */
  async splitByPoliticalParty() {
    const linesSplitter = new LinesSplitter(this.lines)

    try {
      return await linesSplitter.split(POLITICAL_PARTIES)
    } catch (error) {
      throw error
    }
  }

  /**
   * @private
   * @param {!Map} entries Map object that is a result of
   *     splitByPoliticalParties.
   * @return {!Map} Map object containing detailed version of text keyed by
   *     political party name.
   */
  async splitByCategory(entries) {
    for (const entry of entries) {
      const politicalParty = entry[0]
      const lines = entry[1]

      try {
        const linesSplitter = new LinesSplitter(lines)
        const splitted = await linesSplitter.split(CATEGORIES)
        entries.set(politicalParty, splitted)
      } catch (error) {
        throw error
      }
    }
  }

  /**
   * @private
   */
  async formatTotalRevenue(entries) {
    for (const entry of entries) {
      const politicalParty = entry[0]
      const categories = entry[1]

      if (!categories.has(TOTAL_REVENUE)) {
        throw new Error(`Missing total revenue for ${politicalParty} to format`)
      }

      const lines = categories.get(TOTAL_REVENUE)
      const collectedLines = await this.linesCollector.oneNameAndOneValue(lines)

      const totalRevenue = new Map()
      for (const collectedLine of collectedLines) {
        const formattedLine =
            await this.linesFormatter.oneNameAndOnePrice(collectedLine)
        totalRevenue.set(formattedLine[0], formattedLine[1])
      }
      categories.set(TOTAL_REVENUE, totalRevenue)
    }
  }
}

module.exports = PoliticalPartyFormatter
