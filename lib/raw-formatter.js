'use strict'

const fs = require('fs')

const { SimpleLogger } = require('simple-logger')

const logger = new SimpleLogger({ name: 'RawFormatter' })

const CATEGORIES = [
  { name: 'politicalParty', regex: /^〔政 党〕/ },
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
   * @return {!Map} A formatted result.
   */
  async format() {
    const lines = this.text.split('\n')
    const sections = await this.splitByCategory(lines)
    console.log(sections)

    return new Map()
  }

  /**
   * An assumption here is that once a category is found, all lines will belong
   * to some category until it gets to the end.
   * @private
   */
  async splitByCategory(lines) {
    // prepare empty sections
    const sections = {}
    for (const category of CATEGORIES) {
      sections[category.name] = []
    }

    // split by categories
    let currentCategory = null
    for (const line of lines) {
      for (const category of CATEGORIES) {
        if (line.match(category.regex)) {
          currentCategory = category.name
          break
        }
      }

      if (currentCategory) {
        sections[currentCategory].push(line)
      }
    }

    return sections
  }
}

module.exports = RawFormatter
