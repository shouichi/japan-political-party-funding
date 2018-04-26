'use strict'

const KOMEITO = '公明党'
const SOCIAL_DEMOCRATIC_PARTY = '社会民主党'

const POLITICAL_PARTIES = [
  { name: KOMEITO, regex: /^公明党/ },
  { name: SOCIAL_DEMOCRATIC_PARTY, regex: /^社会民主党/ },
]
const CATEGORIES = [
  { name: 'totalRevenue', regex: /^ 収入総額/ },
  { name: 'totalSpending', regex: /^ 支出総額/ },
  { name: 'revenueBreakdown', regex: /^ 本年収入の内訳/ },
  { name: 'spendingBreakdown', regex: /^ 支出の内訳/ },
  { name: 'spendingBreakdown', regex: /^ 支出の内訳/ },
  { name: 'donationBreakdown', regex: /^ 寄附の内訳/ },
  { name: 'assetBreakdown', regex: /^ 資産等の内訳/ },
]

class PoliticalPartyFormatter {
  /**
   */
  constructor(lines) {
    this.lines = lines.slice()
  }

  /**
   */
  async format() {
    const politicalParties = await this.splitByPoliticalParty()
    console.log(politicalParties)

    return new Map()
  }

  /**
   */
  async splitByPoliticalParty() {
    // prepare empty political parties
    const politicalParties = {}
    for (const politicalParty of POLITICAL_PARTIES) {
      politicalParties[politicalParty.name] = []
    }

    // split by political party
    let currentPoliticalParty = null
    for (const line of this.lines) {
      for (const politicalParty of POLITICAL_PARTIES) {
        if (line.match(politicalParty.regex)) {
          currentPoliticalParty = politicalParty.name
          break
        }
      }

      if (currentPoliticalParty) {
        politicalParties[currentPoliticalParty].push(line)
      }
    }

    return politicalParties
  }
}

module.exports = PoliticalPartyFormatter
