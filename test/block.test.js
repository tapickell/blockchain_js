const Block = require('../src/blockchain/block')
const { DIFFICULTY } = require('../config')

describe('Block', () => {
  it('block sets `data` to match input', () => {
    const data = 'dataz'
    const first = Block.mineBlock(Block.genesis(), data)
    expect(first.data).toEqual(data)
  })

  it('block sets `lastHash` to match last blocks hash', () => {
    const gen = Block.genesis()
    const first = Block.mineBlock(gen, 'dataz')
    expect(first.lastHash).toEqual(gen.hash)
  })

  it('generates a hash that matches difficulty', () => {
    const gen = Block.genesis()
    const first = Block.mineToDifficulty(gen, 'dataz', 0)

    expect(first.hash.substring(0, first.difficulty)).toEqual('0'.repeat(first.difficulty))
  })

  it('lowers the difficulty for slowly mined blocks', () => {
    const gen = Block.genesis()
    const first = Block.mineBlock(gen, 'dataz')

    expect(Block.adjustDifficulty(first, first.timestamp + 360000)).toEqual(first.difficulty - 1)
  })

  it('raises the difficulty for quickly mined blocks', () => {
    const gen = Block.genesis()
    const first = Block.mineBlock(gen, 'dataz')

    expect(Block.adjustDifficulty(first, first.timestamp + 1)).toEqual(first.difficulty + 1)
  })
})