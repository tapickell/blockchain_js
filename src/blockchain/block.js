const crypto = require('crypto')
const { DIFFICULTY, MINE_RATE } = require('../../config')

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.nonce = nonce
    this.difficulty = difficulty || DIFFICULTY
    this.data = data
  }

  toString() {
    return `Block -
    Timestamp: ${this.timestamp}
    LastHash: ${this.lastHash}
    ThisHash: ${this.hash}
    Nonce: ${this.nonce}
    Diff: ${this.difficulty}
    Data: ${this.data}
    `
  }

  static genesis(ts = false) {
    let lastHash = Block.hasher('4'.repeat(444))
    return this.mineBlock({ hash: lastHash }, 'alpha', 0, DIFFICULTY, ts)
  }

  static mineToDifficulty(prevBlock, data, nonce = 0) {
    let startNonce = nonce
    let difficulty
    let block
    let startTime = Date.now()
    // console.log(`starting mining: ${startTime} - ${data}`)
    do {
      difficulty = this.adjustDifficulty(prevBlock, Date.now())
      block = this.mineBlock(prevBlock, data, startNonce, difficulty)
      startNonce++
    } while (this.isNotDifficulty(block.hash, difficulty))
    // console.log(`${Date.now() - startTime} ms - matching hash => \n`, block)
    return block
  }

  static isNotDifficulty(hash, difficulty) {
    return hash.substring(0, difficulty) !== '0'.repeat(difficulty)
  }

  static adjustDifficulty(prevBlock, currentTimestamp) {
    let { difficulty, timestamp } = prevBlock
    if (timestamp + MINE_RATE > currentTimestamp) {
      return difficulty + 1
    } else {
      return difficulty - 1
    }
  }

  static mineBlock(prevBlock, data, nonce, difficulty, ts = false) {
    let timestamp = ts || Date.now()
    let lastHash = prevBlock.hash
    let hash = Block.hasher(`${timestamp}${lastHash}${data}${nonce}${difficulty}`)

    return new this(timestamp, lastHash, hash, data, nonce, difficulty)
  }

  static hasher(data) {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    return Block.hasher(`${timestamp}${lastHash}${data}${nonce}${difficulty}`)
  }
}

module.exports = Block