'use strict'

const assert = require('assert')

const LinesFormatter = require('../lib/lines-formatter')

describe('LinesFormatter', () => {
  let linesFormatter
  const nameAndPrice = [
    '収入総額 20,776,777,975',
    '前年繰越額 6,944,786,625',
    '本年収入額 13,831,991,350',
  ]

  beforeEach(() => {
    linesFormatter = new LinesFormatter()
  })

  afterEach(() => {
    linesFormatter = null
  })

  it('formats name and price lines', async () => {
    const totalRevenue =
        await linesFormatter.oneNameAndOnePrice(nameAndPrice[0])
    assert.strictEqual(totalRevenue[0], '収入総額')
    assert.strictEqual(totalRevenue[1], 20776777975)

    const carryOver = await linesFormatter.oneNameAndOnePrice(nameAndPrice[1])
    assert.strictEqual(carryOver[0], '前年繰越額')
    assert.strictEqual(carryOver[1], 6944786625)

    const thisYear = await linesFormatter.oneNameAndOnePrice(nameAndPrice[2])
    assert.strictEqual(thisYear[0], '本年収入額')
    assert.strictEqual(thisYear[1], 13831991350)
  })
})
