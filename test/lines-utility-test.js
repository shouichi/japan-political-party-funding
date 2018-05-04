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
  const oneNameAndOnePrice5 = ' 収入総額 20,776,777,975'
  const donation1 = 'グローバルサイン㈱105,000 渋谷区'
  const space1 = '新宿区 552,200,0001,036.32 14.12.17'
  const space2 = '広島市 91,000,000212.8426. 4. 8'
  const space3 = '静岡県小山町 31,324,5515,138 昭和58. 1.15'
  const space4 = '新宿区 552,200,000 1,036.32 平和 14.12.17'
  const movableProperty1 =
      '宣伝車用カーナビモニターカメラ(1式)2,181,375 12. 9.28'

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

    it('formats a line with head space, one name, and one price', async () => {
      assert.strictEqual(
          await linesUtility.prepareOneNameAndOnePrice(oneNameAndOnePrice5),
          '収入総額 20,776,777,975')
    })
  })

  context('#prepareDonation', () => {
    it('formats a donation line', async () => {
      assert.strictEqual(
          await linesUtility.prepareDonation(donation1),
          'グローバルサイン㈱ 105,000 渋谷区')
    })
  })

  context('#prepareSpace', () => {
    it('formats a space line', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space1),
          '新宿区 552,200,000 1,036.32 平成 14.12.17')
    })

    it('formats a space line with short date', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space2),
          '広島市 91,000,000 212.84 平成 26.04.08')
    })

    it('formats a space line with era', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space3),
          '静岡県小山町 31,324,551 5,138 昭和 58.01.15')
    })

    it('formats a space line that is already prepared', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space4),
          '新宿区 552,200,000 1,036.32 平和 14.12.17')
    })
  })

  context('#prepareMovableProperty', () => {
    it('formats a movable property line', async () => {
      assert.strictEqual(
          await linesUtility.prepareMovableProperty(movableProperty1),
          '宣伝車用カーナビモニターカメラ(1式) 2,181,375 平成 12.09.28')
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
