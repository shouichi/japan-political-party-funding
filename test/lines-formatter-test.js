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
  const donation = [
    '小畑 泰治 500,000 越谷市',
    '高 友美子 112,054 札幌市',
    '遺 長友 孝子 12,246,791 足立区',
    '年間五万円以下のもの56,000',
  ]

  beforeEach(() => {
    linesFormatter = new LinesFormatter()
  })

  afterEach(() => {
    linesFormatter = null
  })

  context('#oneNameAndOnePrice', () => {
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

  context('#donation', () => {
    it('formats donation lines', async () => {
      let result = await linesFormatter.donation(donation[0])
      assert.strictEqual(result[0], null)
      assert.strictEqual(result[1], '小畑泰治')
      assert.strictEqual(result[2], 500000)
      assert.strictEqual(result[3], '越谷市')

      result = await linesFormatter.donation(donation[1])
      assert.strictEqual(result[0], null)
      assert.strictEqual(result[1], '高友美子')
      assert.strictEqual(result[2], 112054)
      assert.strictEqual(result[3], '札幌市')

      result = await linesFormatter.donation(donation[2])
      assert.strictEqual(result[0], '遺')
      assert.strictEqual(result[1], '長友孝子')
      assert.strictEqual(result[2], 12246791)
      assert.strictEqual(result[3], '足立区')

      result = await linesFormatter.donation(donation[3])
      assert.strictEqual(result[0], null)
      assert.strictEqual(result[1], '年間五万円以下のもの')
      assert.strictEqual(result[2], 56000)
      assert.strictEqual(result[3], null)
    })
  })
})
