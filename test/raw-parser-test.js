'use strict'

const assert = require('assert')

const RawParser = require('../lib/raw-parser')

describe('RawParser', () => {
  const reportPath = './test/resources/h28-report-1.pdf'

  it('returns parsed report', async () => {
    const rawParser = new RawParser()
    const text = await rawParser.parse([reportPath])

    assert.equal(text.startsWith('明治二十五年三月三十一日'), true)
  })
})
