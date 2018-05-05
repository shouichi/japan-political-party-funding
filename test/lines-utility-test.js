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
  const space3 = '静岡県小山町 31,324,5515,138 昭和58. 1. 5'
  const space4 = '新宿区 477,200,000948.5 14.12.17'
  const movableProperty1 =
      '宣伝車用カーナビモニターカメラ(1式)2,181,375 12. 9.28'
  const securityDeposit1 = '中山 耕一 4,000,000 22. 4.23'
  const securityDeposit2 = 'あかつき印刷㈱ 815,000,000 昭和62. 4. 1'
  const debt1 = '社会労働運動家センター710,000,000'
  const debt2 = '金子 徹 56,280,000'
  const security1 = '利付国債 200,000,00028. 4.15'
  const lending1 = 'かつき印刷㈱ 761,200,000'

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
      assert.strictEqual(
          await linesUtility.prepareSpace(space4),
          '新宿区 477,200,000 948.5 平成 14.12.17')
    })

    it('formats a space line with short date', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space2),
          '広島市 91,000,000 212.84 平成 26.04.08')
    })

    it('formats a space line with era', async () => {
      assert.strictEqual(
          await linesUtility.prepareSpace(space3),
          '静岡県小山町 31,324,551 5,138 昭和 58.01.05')
    })
  })

  context('#prepareMovableProperty', () => {
    it('formats a movable property line', async () => {
      assert.strictEqual(
          await linesUtility.prepareMovableProperty(movableProperty1),
          '宣伝車用カーナビモニターカメラ(1式) 2,181,375 平成 12.09.28')
    })
  })

  context('#prepareSecurityDeposit', () => {
    it('formats a security deposit line', async () => {
      assert.strictEqual(
          await linesUtility.prepareSecurityDeposit(securityDeposit1),
          '中山耕一 4,000,000 平成 22.04.23')
    })

    it('formats a security deposit line with era', async () => {
      assert.strictEqual(
          await linesUtility.prepareSecurityDeposit(securityDeposit2),
          'あかつき印刷㈱ 815,000,000 昭和 62.04.01')
    })
  })

  context('#prepareDebt', () => {
    it('formats a debt line that represents an organization', async () => {
      assert.strictEqual(
          await linesUtility.prepareDebt(debt1),
          '社会労働運動家センター 710,000,000')
    })

    it('formats a debt line that an individual', async () => {
      assert.strictEqual(
          await linesUtility.prepareDebt(debt2),
          '金子徹 56,280,000')
    })
  })

  context('#prepareSecurity', () => {
    it('formats a security line', async () => {
      assert.strictEqual(
          await linesUtility.prepareSecurity(security1),
          '利付国債 200,000,000 平成 28.04.15')
    })
  })

  context('#prepareLending', () => {
    it('formats a lending line', async () => {
      assert.strictEqual(
          await linesUtility.prepareLending(lending1),
          'かつき印刷㈱ 761,200,000')
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
