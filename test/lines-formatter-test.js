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
  const space = [
    '広島市 91,000,000 212.84 平成 26.04.08',
    '静岡県小山町 31,324,551 5,138 昭和 58.01.15',
  ]
  const movableProperty = [
    '宣伝車用カーナビモニターカメラ(1式) 2,181,375 平成 12.09.28',
  ]
  const savings = [
    '1,190,000,000',
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

  context('#space', () => {
    it('formats space lines', async () => {
      let result = await linesFormatter.space(space[0])
      assert.strictEqual(result[0], '広島市')
      assert.strictEqual(result[1], 91000000)
      assert.strictEqual(result[2], 212.84)
      assert.strictEqual(result[3], '平成')
      assert.strictEqual(result[4], '26.04.08')

      result = await linesFormatter.space(space[1])
      assert.strictEqual(result[0], '静岡県小山町')
      assert.strictEqual(result[1], 31324551)
      assert.strictEqual(result[2], 5138)
      assert.strictEqual(result[3], '昭和')
      assert.strictEqual(result[4], '58.01.15')
    })
  })

  context('#movableProperty', () => {
    it('formats movable property lines', async () => {
      let result = await linesFormatter.movableProperty(movableProperty[0])
      assert.strictEqual(result[0], '宣伝車用カーナビモニターカメラ(1式)')
      assert.strictEqual(result[1], 2181375)
      assert.strictEqual(result[2], '平成')
      assert.strictEqual(result[3], '12.09.28')
    })
  })

  context('#savings', () => {
    it('formats savings lines', async () => {
      let result = await linesFormatter.savings(savings[0])
      assert.strictEqual(result[0], 1190000000)
    })
  })
})
