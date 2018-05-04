'use strict'

const LinesCollector = require('./lines-collector')
const LinesFormatter = require('./lines-formatter')
const LinesSplitter = require('./lines-splitter')
const LinesUtility = require('./lines-utility')

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
const PARTY_OVERVIEW = '特定パーティーの概要'
const CATEGORIES = [
  { name: TOTAL_REVENUE, regex: /^\s*収入総額/ },
  { name: TOTAL_SPENDING, regex: /^\s*支出総額/ },
  { name: REVENUE_BREAKDOWN, regex: /^\s*本年収入の内訳/ },
  { name: SPENDING_BREAKDOWN, regex: /^\s*支出の内訳/ },
  { name: DONATION_BREAKDOWN, regex: /^\s*寄附の内訳/ },
  { name: ASSET_BREAKDOWN, regex: /^\s*資産等の内訳/ },
  { name: PARTY_OVERVIEW, regex: /^\s*特定パーティーの概要/ },
]

const REVENUE_BREAKDOWN_CATEGORIES = [
  { name: '個人の党費/会費', regex: /^\s*個人の党費/ },
  { name: '寄附', regex: /^\s*寄附/ },
  {
    name: '機関紙誌の発行その他の事業による収入',
    regex: /^\s*機関紙誌の発行その他の事業/,
  },
  {
    name: '本部又は支部から供与された交付金に係る収入',
    regex: /^\s*本部又は支部から供与された/,
  },
  { name: 'その他の収入', regex: /^\s*その他の収入/ },
]

const SPENDING_BREAKDOWN_CATEGORIES = [
  { name: '経常経費', regex: /^\s*経常経費/ },
  { name: '政治活動費', regex: /^\s*政治活動費/ },
  { name: '調査研究費', regex: /^\s*調査研究費/ },
  { name: '寄附/交付金', regex: /^\s*寄附・交付金/ },
]

const DONATION_BREAKDOWN_CATEGORIES = [
  { name: '個人分', regex: /^\s*〔個人分〕/ },
  { name: '団体分', regex: /^\s*〔団体分〕/ },
  { name: '政治団体分', regex: /^\s*〔政治団体分〕/ },
]

const ASSET_LAND = '土地'
const ASSET_BUILDING = '建物'
const ASSET_MOVABLE_PROPERTY = '動産'
const ASSET_SAVINGS = '預金又は貯金'
const ASSET_SECURITY_DEPOSIT = '敷金'
const ASSET_DEBT = '借入金'
const ASSET_BREAKDOWN_CATEGORIES = [
  { name: ASSET_LAND, regex: /^\s*〔土地〕/ },
  { name: ASSET_BUILDING, regex: /^\s*〔建物〕/ },
  { name: ASSET_MOVABLE_PROPERTY, regex: /^\s*〔動産〕/ },
  { name: ASSET_SAVINGS, regex: /^\s*〔預金又は貯金〕/ },
  { name: ASSET_SECURITY_DEPOSIT, regex: /^\s*〔敷金〕/ },
  { name: ASSET_DEBT, regex: /^\s*〔借入金〕/ },
  { name: '有価証券', regex: /^\s*〔有価証券〕/ },
  { name: '貸付金', regex: /^\s*〔貸付金〕/ },
  { name: '出資による権利', regex: /^\s*〔出資による権利〕/ },
  { name: '施設の利用に関する権利', regex: /^\s*〔施設の利用に関する権利〕/ },
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
    this.linesUtility = new LinesUtility()
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
   * @return {string} PARTY_OVERVIEW
   */
  static get PARTY_OVERVIEW() {
    return PARTY_OVERVIEW
  }

  /**
   */
  async format() {
    const result = new Map()

    const byPoliticalParty = await this.splitByPoliticalParty()
    for (const entry of byPoliticalParty) {
      const politicalParty = entry[0]
      let data = entry[1]

      data = await this.splitByCategory(data)
      data = await this.formatTotalRevenue(data)
      data = await this.formatTotalSpending(data)
      data = await this.formatRevenueBreakdown(data)
      data = await this.formatSpendingBreakdown(data)
      data = await this.formatDonationBreakdown(data)
      //console.log(`###### ${politicalParty}`)
      data = await this.formatAssetBreakdown(data)

      result.set(politicalParty, data)
    }

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
   * @param {!Array<string>} lines Lines of text representing a political party
   *     section.
   * @return {!Map} Map object containing sections inside the given political
   *     party data.
   */
  async splitByCategory(lines) {
    try {
      const linesSplitter = new LinesSplitter(lines)
      return await linesSplitter.split(CATEGORIES)
    } catch (error) {
      throw error
    }
  }

  /**
   * @private
   */
  async formatTotalRevenue(categories) {
    if (!categories.has(TOTAL_REVENUE)) {
      throw new Error(`Missing total revenue category to format`)
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

    return categories
  }

  /**
   * @private
   */
  async formatTotalSpending(categories) {
    if (!categories.has(TOTAL_SPENDING)) {
      throw new Error(`Missing total spending category to format`)
    }

    const lines = categories.get(TOTAL_SPENDING)
    const collectedLines = await this.linesCollector.oneNameAndOneValue(lines)

    const totalSpending = new Map()
    for (const collectedLine of collectedLines) {
      const formattedLine =
          await this.linesFormatter.oneNameAndOnePrice(collectedLine)
      totalSpending.set(formattedLine[0], formattedLine[1])
    }
    categories.set(TOTAL_SPENDING, totalSpending)

    return categories
  }

  /**
   * @private
   */
  async formatRevenueBreakdown(categories) {
    if (!categories.has(REVENUE_BREAKDOWN)) {
      throw new Error(`Missing revenue breakdown category to format`)
    }

    const revenueBreakdownLines = categories.get(REVENUE_BREAKDOWN)
    const linesSplitter = new LinesSplitter(revenueBreakdownLines)
    const revenueBreakdownCategories =
        await linesSplitter.split(REVENUE_BREAKDOWN_CATEGORIES)

    const revenueBreakdown = new Map()
    for (const revenueBreakdownCategory of revenueBreakdownCategories) {
      const categoryName = revenueBreakdownCategory[0]
      const categoryLines = revenueBreakdownCategory[1]
      const category = new Map()

      const collected =
          await this.linesCollector.oneNameAndOneValue(categoryLines)
      for (const line of collected) {
        const formatted = await this.linesFormatter.oneNameAndOnePrice(line)
        category.set(formatted[0], formatted[1])
      }
      revenueBreakdown.set(categoryName, category)
    }
    categories.set(REVENUE_BREAKDOWN, revenueBreakdown)

    return categories
  }

  /**
   * @private
   */
  async formatSpendingBreakdown(categories) {
    if (!categories.has(SPENDING_BREAKDOWN)) {
      throw new Error(`Missing spending breakdown category to format`)
    }

    const spendingBreakdownLines = categories.get(SPENDING_BREAKDOWN)
    const linesSplitter = new LinesSplitter(spendingBreakdownLines)
    const spendingBreakdownCategories =
        await linesSplitter.split(SPENDING_BREAKDOWN_CATEGORIES)

    const spendingBreakdown = new Map()
    for (const spendingBreakdownCategory of spendingBreakdownCategories) {
      const categoryName = spendingBreakdownCategory[0]
      const categoryLines = spendingBreakdownCategory[1]
      const category = new Map()

      const collected =
          await this.linesCollector.oneNameAndOneValue(categoryLines)
      for (const line of collected) {
        const formatted = await this.linesFormatter.oneNameAndOnePrice(line)
        category.set(formatted[0], formatted[1])
      }
      spendingBreakdown.set(categoryName, category)
    }
    categories.set(SPENDING_BREAKDOWN, spendingBreakdown)

    return categories
  }

  /**
   * @private
   */
  async formatDonationBreakdown(categories) {
    if (!categories.has(DONATION_BREAKDOWN)) {
      throw new Error(`Missing donation breakdown category to format`)
    }

    const donationBreakdownLines = categories.get(DONATION_BREAKDOWN)
    const linesSplitter = new LinesSplitter(donationBreakdownLines)
    const donationBreakdownCategories =
        await linesSplitter.split(DONATION_BREAKDOWN_CATEGORIES)

    const donationBreakdown = new Map()
    for (const donationBreakdownCategory of donationBreakdownCategories) {
      const categoryName = donationBreakdownCategory[0]
      const categoryLines = donationBreakdownCategory[1]
      const category = new Map()

      const collected =
          await this.linesCollector.donation(categoryLines)
      for (const line of collected) {
        const formatted = await this.linesFormatter.donation(line)
        category.set(formatted[0], formatted[1])
      }
      donationBreakdown.set(categoryName, category)
    }
    categories.set(DONATION_BREAKDOWN, donationBreakdown)

    return categories
  }

  /**
   * @private
   */
  async formatAssetBreakdown(categories) {
    if (!categories.has(ASSET_BREAKDOWN)) {
      throw new Error(`Missing asset breakdown category to format`)
    }

    const assetBreakdownLines = categories.get(ASSET_BREAKDOWN)
    const linesSplitter = new LinesSplitter(assetBreakdownLines)
    const assetBreakdownCategories =
        await linesSplitter.split(ASSET_BREAKDOWN_CATEGORIES)

    const assetBreakdown = new Map()
    for (const assetBreakdownCategory of assetBreakdownCategories) {
      const categoryName = assetBreakdownCategory[0]
      const categoryLines = assetBreakdownCategory[1]
      const category = new Map()
      const data = []

      // remove the first line
      categoryLines.shift()
      const collected =
          await this.linesCollector.space(categoryLines)
      //console.log(`${categoryName} ====================`)
      //console.log(collected)
      for (const line of collected) {
        if ([ASSET_LAND, ASSET_BUILDING].includes(categoryName)) {
          const formatted = await this.linesFormatter.space(line)
          //console.log(line)
          //console.log(formatted)
          data.push(formatted)
        } else if ([ASSET_MOVABLE_PROPERTY].includes(categoryName)) {
          const formatted = await this.linesFormatter.movableProperty(line)
          //console.log(line)
          //console.log(formatted)
          data.push(formatted)
        } else if ([ASSET_SAVINGS].includes(categoryName)) {
          const formatted = await this.linesFormatter.savings(line)
          //console.log(line)
          //console.log(formatted)
          data.push(formatted)
        } else if ([ASSET_SECURITY_DEPOSIT].includes(categoryName)) {
          const formatted = await this.linesFormatter.securityDeposit(line)
          //console.log(line)
          //console.log(formatted)
          data.push(formatted)
        } else if ([ASSET_DEBT].includes(categoryName)) {
          const formatted = await this.linesFormatter.debt(line)
          //console.log(line)
          //console.log(formatted)
          data.push(formatted)
        } else {
          data.push(line)
        }
      }
      assetBreakdown.set(categoryName, data)
    }
    //console.log(assetBreakdown)
    categories.set(ASSET_BREAKDOWN, assetBreakdown)

    return categories
  }
}

module.exports = PoliticalPartyFormatter
