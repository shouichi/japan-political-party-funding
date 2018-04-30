'use strict'

const LinesCollector = require('./lines-collector')
const LinesFormatter = require('./lines-formatter')
const LinesSplitter = require('./lines-splitter')

const KOMEITO = '公明党'
const SOCIAL_DEMOCRATIC_PARTY = '社会民主党'
const LIBERAL_PARTY = '自由党'
const LIBERAL_DEMOCRATIC_PARTY = '自由民主党本部'
const NIPPON_ISHIN_NO_KAI = '日本維新の会'
const PARTY_OF_JAPANESE_KOKORO = '日本のこころ'
const JAPANESE_COMMUNIST_PARTY = '日本共産党中央委員会'
const DEMOCRATIC_PARTY = '民進党'
const POLITICAL_PARTIES = [
  { name: KOMEITO, regex: /^公明党/ },
  { name: SOCIAL_DEMOCRATIC_PARTY, regex: /^社会民主党/ },
  { name: LIBERAL_PARTY, regex: /^自由党/ },
  { name: LIBERAL_DEMOCRATIC_PARTY, regex: /^自由民主党本部/ },
  { name: NIPPON_ISHIN_NO_KAI, regex: /^日本維新の会/ },
  { name: PARTY_OF_JAPANESE_KOKORO, regex: /^日本のこころ/ },
  { name: JAPANESE_COMMUNIST_PARTY, regex: /^日本共産党中央委員会/ },
  { name: DEMOCRATIC_PARTY, regex: /^民進党/ },
]

const TOTAL_REVENUE = '収入総額'
const TOTAL_SPENDING = '支出総額'
const REVENUE_BREAKDOWN = '本年収入の内訳'
const SPENDING_BREAKDOWN = '支出の内訳'
const DONATION_BREAKDOWN = '寄附の内訳'
const ASSET_BREAKDOWN = '資産等の内訳'
const CATEGORIES = [
  { name: TOTAL_REVENUE, regex: /^\s*収入総額/ },
  { name: TOTAL_SPENDING, regex: /^\s*支出総額/ },
  { name: REVENUE_BREAKDOWN, regex: /^\s*本年収入の内訳/ },
  { name: SPENDING_BREAKDOWN, regex: /^\s*支出の内訳/ },
  { name: DONATION_BREAKDOWN, regex: /^\s*寄附の内訳/ },
  { name: ASSET_BREAKDOWN, regex: /^\s*資産等の内訳/ },
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
   * @return {string} LIBERAL_PARTY
   */
  static get LIBERAL_PARTY() {
    return LIBERAL_PARTY
  }

  /**
   * @return {string} LIBERAL_DEMOCRATIC_PARTY
   */
  static get LIBERAL_DEMOCRATIC_PARTY() {
    return LIBERAL_DEMOCRATIC_PARTY
  }

  /**
   * @return {string} NIPPON_ISHIN_NO_KAI
   */
  static get NIPPON_ISHIN_NO_KAI() {
    return NIPPON_ISHIN_NO_KAI
  }

  /**
   * @return {string} PARTY_OF_JAPANESE_KOKORO
   */
  static get PARTY_OF_JAPANESE_KOKORO() {
    return PARTY_OF_JAPANESE_KOKORO
  }

  /**
   * @return {string} JAPANESE_COMMUNIST_PARTY
   */
  static get JAPANESE_COMMUNIST_PARTY() {
    return JAPANESE_COMMUNIST_PARTY
  }

  /**
   * @return {string} DEMOCRATIC_PARTY
   */
  static get DEMOCRATIC_PARTY() {
    return DEMOCRATIC_PARTY
  }

  /**
   * @return {string} TOTAL_REVENUE
   */
  static get TOTAL_REVENUE() {
    return TOTAL_REVENUE
  }

  /**
   * @return {string} TOTAL_SPENDING
   */
  static get TOTAL_SPENDING() {
    return TOTAL_SPENDING
  }

  /**
   * @return {string} REVENUE_BREAKDOWN
   */
  static get REVENUE_BREAKDOWN() {
    return REVENUE_BREAKDOWN
  }

  /**
   * @return {string} SPENDING_BREAKDOWN
   */
  static get SPENDING_BREAKDOWN() {
    return SPENDING_BREAKDOWN
  }

  /**
   * @return {string} DONATION_BREAKDOWN
   */
  static get DONATION_BREAKDOWN() {
    return DONATION_BREAKDOWN
  }

  /**
   * @return {string} ASSET_BREAKDOWN
   */
  static get ASSET_BREAKDOWN() {
    return ASSET_BREAKDOWN
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
