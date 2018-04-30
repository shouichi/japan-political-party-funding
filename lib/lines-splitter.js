'use strict'

/**
 * LinesSplitter splits lines of text by given regex, and key them by given
 * name.
 * It assumes that once one of regex identifies an entry, the rest of lines
 * belongs to some entry.
 */
class LinesSplitter {
  /**
   * @param {!Array<string>} lines Lines of text.
   */
  constructor(lines) {
    this.lines = lines.slice()
  }

  /**
   * @param {!Array<!Map<string, string>>} entries Array object containing a
   *     list of Map objects. Each Map object needs to contain "name" and
   *     "regex" entry, and each represents a name used as a key for lines
   *     splitted by regex respectively.
   * @return {!Map} Map object containing lines keyed by a name of entries
   *     parameter. Note that the matching line by regex will be a part of
   *     resulting lines.
   */
  async split(entries) {
    // prepare empty map
    const result = new Map()
    for (const entry of entries) {
      result.set(entry.name, [])
    }

    // split by regex
    let currentName = null
    for (const line of this.lines) {
      for (const entry of entries) {
        if (line.match(entry.regex)) {
          currentName = entry.name
          break
        }
      }

      if (currentName) {
        result.get(currentName).push(line)
      }
    }

    return result
  }
}

module.exports = LinesSplitter
