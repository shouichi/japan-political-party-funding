'use strict'

const assert = require('assert')
const fs = require('fs')

const PoliticalPartyFormatter = require('../lib/political-party-formatter')

const POLITICAL_PARTY_TEXT_PATH = './test/resources/political-party.txt'

describe('PoliticalPartyFormatter', () => {
  let lines

  beforeEach(() => {
    const text =
        fs.readFileSync(POLITICAL_PARTY_TEXT_PATH, { encoding: 'utf8' })
    lines = text.split('\n')
  })

  afterEach(() => {
    lines = null
  })

  it('formats political party section', async () => {
    const formatter = new PoliticalPartyFormatter(lines)
    const result = await formatter.format()

    assert.equal(
        result.has(PoliticalPartyFormatter.KOMEITO), true)
  })
})
