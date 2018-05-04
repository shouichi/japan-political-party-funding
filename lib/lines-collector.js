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

      // spaces are very important clue as to how a line should be parsed.
      // for that reason, it checks when to combine lines with trimmed lines,
      // but it uses un-trimmed lines when combining.
      currentLines += line
      previousLine = cleanedLine
    }
    result.push(currentLines)

    return result.filter((line) => {
      return line.length > 0
    })
  }

  /**
   * @param {!Array<string>} lines Lines to collect.
   * @return {!Array<string>} Array of lines collected.
   */
  async donation(lines) {
    return this.oneNameAndOneValue(lines)
  }

  /**
   * @param {!Array<string>} lines Lines to collect.
   * @return {!Array<string>} Array of lines collected.
   */
  async space(lines) {
    let preCollected
    try {
      preCollected = await this.oneNameAndOneValue(lines)
    } catch (error) {
      throw error
    }

    // join a line if the line starts with '昭和'
    const newCollected = []
    for (let line of preCollected) {
      if (line.startsWith('昭和')) {
        const previousLine = newCollected.pop()
        line = `${previousLine}${line}`
      }
      newCollected.push(line)
    }

    return newCollected
  }
}

module.exports = LinesCollector
