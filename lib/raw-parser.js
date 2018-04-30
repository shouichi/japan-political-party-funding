'use strict'

const textract = require('textract')

/**
 * RawParser parses a raw Seijishikin Shuushi Houkoku file (PDF). Refer to
 * this page (http://www.soumu.go.jp/senkyo/seiji_s/data_seiji/index.html) to
 * get the actual files.
 */
class RawParser {
  /**
   */
  constructor() {
  }

  /**
   * @param {!Array<string>} paths Array of a file path for Seijishikin Shuushi
   *     Houkoku.
   * @return {!Map} Parsed result of the report.
   */
  async parse(paths) {
    try {
      return await this.parseRaw(paths)
    } catch (error) {
      throw error
    }
  }

  /**
   * @private
   */
  async parseRaw(paths) {
    const texts = []
    for (const path of paths) {
      try {
        texts.push(await this.parseFileRaw(path))
      } catch (error) {
        throw error
      }
    }

    return texts.join('')
  }

  /**
   * @private
   */
  async parseFileRaw(path) {
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(
          path,
          { preserveLineBreaks: true },
          (error, text) => {
            if (error) {
              return reject(error)
            }

            return resolve(text)
          })
    })
  }
}

module.exports = RawParser
