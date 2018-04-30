'use strict'

const assert = require('assert')

const LinesSplitter = require('../lib/lines-splitter')

describe('LinesSplitter', () => {
  const lines = [
    '1) subject 1',
    'this is line 1 for subject 1',
    'this is line 2 for subject 2',
    '',
    '[2] this IS subject 2',
    'this is line 1 for subject 2',
  ]
  const entries = [
    { name: 'Subject1', regex: /^1\)\ssubject\s1/ },
    { name: 'Subject2', regex: /^\[2\]/ },
  ]

  it('splits lines by given entries', async () => {
    const linesSplitter = new LinesSplitter(lines)
    const result = await linesSplitter.split(entries)

    assert.equal(result.has('Subject1'), true)
    assert.equal(result.has('Subject2'), true)
    assert.equal(result.get('Subject1').length, 4)
    assert.equal(result.get('Subject2').length, 2)
  })
})
