'use strict'

const assert = require('assert')
const fs = require('fs')

const RawFormatter = require('../lib/raw-formatter')

const REPORT_TEXT_PATH = './test/resources/h28-report-1.txt'

describe('RawFormatter', () => {
  let text

  beforeEach(() => {
    text = fs.readFileSync(REPORT_TEXT_PATH, { encoding: 'utf8' })
  })

  afterEach(() => {
    text = ''
  })

  it.skip('formats a raw text', async () => {
    const rawFormatter = new RawFormatter(text)
    const report = await rawFormatter.format()

    assert.equal(report.has('politicalParties'), true)
  })
})
