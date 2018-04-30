'use strict'

const assert = require('assert')
const fs = require('fs')

const PoliticalPartyFormatter = require('../lib/political-party-formatter')

const POLITICAL_PARTY_TEXT_PATH = './test/resources/political-party.txt'

describe('PoliticalPartyFormatter', () => {
  let lines
  let formatter

  before(() => {
    const text =
        fs.readFileSync(POLITICAL_PARTY_TEXT_PATH, { encoding: 'utf8' })
    lines = text.split('\n')
  })

  after(() => {
    lines = null
  })

  beforeEach(() => {
    formatter = new PoliticalPartyFormatter(lines)
  })

  afterEach(() => {
    formatter = null
  })

  it('formats political party section', async () => {
    const result = await formatter.format()

    assert.equal(
        result.has(PoliticalPartyFormatter.KOMEITO), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.SOCIAL_DEMOCRATIC_PARTY), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.LIBERAL_PARTY), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.LIBERAL_DEMOCRATIC_PARTY), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.NIPPON_ISHIN_NO_KAI), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.PARTY_OF_JAPANESE_KOKORO), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.JAPANESE_COMMUNIST_PARTY), true)
    assert.equal(
        result.has(PoliticalPartyFormatter.DEMOCRATIC_PARTY), true)
  })

  it('formats category section', async () => {
    const result = await formatter.format()
    const komeito = result.get(PoliticalPartyFormatter.KOMEITO)

    assert.equal(
        komeito.has(PoliticalPartyFormatter.TOTAL_REVENUE), true)
  })

  it('formats total revenue section', async () => {
    const result = await formatter.format()
    const komeito = result.get(PoliticalPartyFormatter.KOMEITO)
    const totalRevenue = komeito.get(PoliticalPartyFormatter.TOTAL_REVENUE)

    assert.equal(totalRevenue.has('収入総額'), true)
    assert.equal(totalRevenue.has('前年繰越額'), true)
    assert.equal(totalRevenue.has('本年収入額'), true)
  })
})
