'use strict'

const assert = require('assert')

const LinesUtility = require('../lib/lines-utility')

describe('LinesUtility', () => {
  let linesUtility
  const oneNameAndOnePrice1 = '平成年月日木曜日(号外第号)官報 機関紙誌の発行' +
      'その他の事業による収入 310,415,181'
  const oneNameAndOnePrice2 = '平成年月日木曜日(号外第号)官報 機関紙誌の発行' +
      'その他の事業による収入310,415,181'
  const oneNameAndOnePrice3 = '機関紙誌の発行その他の事業による収入310,415,181'
  const oneNameAndOnePrice4 = '機関紙誌の発行その他の事業による収入   ' +
      '310,415,181'
  const donation1 = 'グローバルサイン㈱105,000 渋谷区'

  beforeEach(() => {
    linesUtility = new LinesUtility()
  })

  afterEach(() => {
    linesUtility = null
  })

  context('#prepareOneNameAndOnePrice', () => {
    it('formats a line with multiple names, spaces, and and one price',
        async () => {
          assert.strictEqual(
              await linesUtility.prepareOneNameAndOnePrice(oneNameAndOnePrice1),
              '機関紙誌の発行その他の事業による収入 310,415,181')
    })

    it('formats a line with multiple names and one price', async () => {
      assert.strictEqual(
          await linesUtility.prepareOneNameAndOnePrice(oneNameAndOnePrice2),
          '機関紙誌の発行その他の事業による収入 310,415,181')
    })

    it('formats a line with one name and one price', async () => {
      assert.strictEqual(
          await linesUtility.prepareOneNameAndOnePrice(oneNameAndOnePrice3),
          '機関紙誌の発行その他の事業による収入 310,415,181')
    })

    it('formats a line with one name, spaces, and one price', async () => {
      assert.strictEqual(
          await linesUtility.prepareOneNameAndOnePrice(oneNameAndOnePrice4),
          '機関紙誌の発行その他の事業による収入 310,415,181')
    })
  })

  context('#prepareDonation', () => {
    it('formats a donation line', async () => {
      assert.strictEqual(
          await linesUtility.prepareDonation(donation1),
          'グローバルサイン㈱ 105,000 渋谷区')
    })
  })

  context('#parsePrice', () => {
    it('converts a price in string to a numeric value', async () => {
      assert.strictEqual(await linesUtility.parsePrice('12,345,678'), 12345678)
      assert.strictEqual(await linesUtility.parsePrice('12,345'), 12345)
      assert.strictEqual(await linesUtility.parsePrice('12'), 12)
    })
  })
})
