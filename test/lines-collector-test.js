'use strict'

const assert = require('assert')

const LinesCollector = require('../lib/lines-collector')

describe('LinesCollector', () => {
  let linesCollector
  const nameAndPrice = [
    ' 収入総額 20,',
    '776,',
    '777,',
    '975',
    '前年繰越額 6,',
    '944,',
    '786,',
    '625',
    '本年収入額 13,',
    '831,',
    '991,',
    '350',
  ]
  const nameAndPriceMultiLine = [
    '機関紙誌の発行その他の事業に',
    'よる収入',
    '8,',
    '611,',
    '264,',
    '707',
    '公明新聞 7,',
    '329,',
    '912,',
    '315',
    '月刊公明 39,',
    '197,',
    '140',
    '公明グラフ 749,',
  ]
  const donation = [
    '小畑 泰治 500,',
    '000 越谷市',
    '高 友美子 112,',
    '054 札幌市',
    ' ',
    '遺 長友 孝子 12,',
    '246,',
    '791 足立区',
    '前田 眞一 100,',
    '000 さいたま市',
    '年間五万円以下の',
    'もの',
    '56,',
    '000',
  ]
  const land = [
    '新宿区 552,',
    '200,',
    '000',
    '1,',
    '036.32 ',
    '14.12.17',
    '新宿区 543,',
    '600,',
    '000',
    '1,',
    '003.87 ',
    '14.12.17',
  ]

  beforeEach(() => {
    linesCollector = new LinesCollector()
  })

  afterEach(() => {
    linesCollector = null
  })

  context('#oneNameAndOneValue', () => {
    it('collects name and price lines', async () => {
      const result = await linesCollector.oneNameAndOneValue(nameAndPrice)

      assert.strictEqual(result.length, 3)
      assert.strictEqual(result[0], '収入総額 20,776,777,975')
      assert.strictEqual(result[1], '前年繰越額 6,944,786,625')
      assert.strictEqual(result[2], '本年収入額 13,831,991,350')
    })

    it('collects name and price muitl-line lines', async () => {
      const result = await linesCollector.oneNameAndOneValue(
          nameAndPriceMultiLine)

      assert.strictEqual(result.length, 4)
      assert.strictEqual(
          result[0], '機関紙誌の発行その他の事業による収入8,611,264,707')
      assert.strictEqual(result[1], '公明新聞 7,329,912,315')
      assert.strictEqual(result[2], '月刊公明 39,197,140')
      assert.strictEqual(result[3], '公明グラフ 749,')
    })
  })

  context('#donation', () => {
    it('collects donation lines', async () => {
      const result = await linesCollector.donation(donation)

      assert.strictEqual(result.length, 5)
      assert.strictEqual(result[0], '小畑 泰治 500,000 越谷市')
      assert.strictEqual(result[1], '高 友美子 112,054 札幌市')
      assert.strictEqual(result[2], '遺 長友 孝子 12,246,791 足立区')
      assert.strictEqual(result[3], '前田 眞一 100,000 さいたま市')
      assert.strictEqual(result[4], '年間五万円以下のもの56,000')
    })
  })

  it.skip('collects land lines', async () => {
    const result = await linesCollector.oneNameAndOneValue(land)

    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[0], '新宿区 552,200,0001,036.3214.12.17')
    assert.strictEqual(result[1], '新宿区 543,600,0001,003.8714.12.17')
  })
})
