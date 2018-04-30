'use strict'

/**
 * LinesCollector combines lines to make each of line represent the line shown
 * exactly on PDF. Since the PDF has multiple ways a line is represented,
 * LinesCollector provides multiple methods to collect lines for each way.
 */
class LinesCollector {
  /**
   */
  constructor() {
  }

  /**
   * @param {!Array<string>} lines Lines to collect.
   * @return {!Array<string>} Array of lines collected.
   */
  async oneNameAndOneValue(lines) {
    const result = []

    let currentLines = ''
    let previousLine = ''
    for (const line of lines) {
      const cleanedLine = line.trim()

      if (!cleanedLine.match(/^\d/)) {
        // make sure that the current line is not a continueation of name from
        // previous line
        if (previousLine.match(/^\d/)) {
          result.push(currentLines)
          currentLines = ''
        }
      }

      currentLines += cleanedLine
      previousLine = cleanedLine
    }
    result.push(currentLines)

    return result.filter((line) => {
      return line.length > 0
    })
  }
}

module.exports = LinesCollector
