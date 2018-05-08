'use strict'

const assert = require('assert')

const MapUtility = require('../lib/map-utility')

describe('MapUtility', () => {
  let mapUtility
  let map1
  let map2

  before(() => {
    map1 = new Map()
    map1.set('key1', 'value1')
    map1.set('key2', 2)

    map2 = new Map()
    map2.set('key1', new Map())
    map2.get('key1').set('nestedKey1', new Map())
    map2.get('key1').get('nestedKey1').set('nestedNestedKey1', 'unko')
  })

  beforeEach(() => {
    mapUtility = new MapUtility()
  })

  afterEach(() => {
    mapUtility = null
  })

  after(() => {
    map1 = null
    map2 = null
  })

  it('converts a simple Map object to an Object object', async () => {
    const object = await mapUtility.toObject(map1)

    assert.strictEqual(object['key1'], 'value1')
    assert.strictEqual(object['key2'], 2)
  })

  it('converts a nested Map object to an Object object', async () => {
    const object = await mapUtility.toObject(map2)

    assert.strictEqual(object['key1']['nestedKey1']['nestedNestedKey1'], 'unko')
  })
})
