'use strict'

const assert = require('assert')

const RawParser = require('../lib/raw-parser')

describe('RawParser', () => {
  const reportPath = './test/resources/h28-report-1.pdf'

  it.skip('returns parsed report', async () => {
    const rawParser = new RawParser()
    const report = await rawParser.parse([reportPath])

    assert.equal(report.has('politicalParties'), true)
  })
})
