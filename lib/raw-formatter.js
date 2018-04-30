'use strict'

const { SimpleLogger } = require('simple-logger')

const LinesSplitter = require('./lines-splitter')

const logger = new SimpleLogger({ name: 'RawFormatter' })

const POLITICAL_PARTY = '政党'

const CATEGORIES = [
  { name: POLITICAL_PARTY, regex: /^〔政 党〕/ },
  { name: 'politicalPartyBranch', regex: /^〔政 党 の 支 部〕/ },
]

/**
 * RawFormatter formats a raw text extracted by RawParser.
 * A raw text data this class handles assumes and defines the following:
 * - A raw text is grouped by a top level group called "category".
 *   - A category includes "political party", "political party branch",
 *     and "fund raising foundation".
 * - A raw text keeps its original format/style such as break lines and spaces
 *   (it shouldn't have been modified from what's extracted by textract).
 */
class RawFormatter {
  /**
   * @param {string} text A raw text data to format.
   */
  constructor(text) {
    this.text = text
  }

  /**
   * @return {string} POLITICAL_PARTY
   */
  static get POLITICAL_PARTY() {
    return POLITICAL_PARTY
  }

  /**
   * @return {!Map} A formatted result.
   */
  async format() {
    const lines = this.text.split('\n')
    return await this.splitByCategory(lines)
  }

  /**
   * An assumption here is that once a category is found, all lines will belong
   * to some category until it gets to the end.
   * @private
   */
  async splitByCategory(lines) {
    const linesSplitter = new LinesSplitter(lines)
    return await linesSplitter.split(CATEGORIES)
  }
}

module.exports = RawFormatter
