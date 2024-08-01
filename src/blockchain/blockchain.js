const Block = require('./block')

class Blockchain {
  constructor(ts = false) {
    this.chain = [Block.genesis(ts)]
  }

  genesis() {
    return this.chain[0]
  }

  head() {
    return this.chain[this.chain.length - 1]
  }

  tail() {
    return this.chain.slice(1)
  }

  fullChain() {
    return this.chain
  }

  chainLength() {
    return this.chain
  }

  addBlock(data, nonce = 0) {
    const block = Block.mineToDifficulty(this.head(), data, nonce)
    this.chain.push(block)

    return block
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('received chain in replaceChain new chain not longer than current chain')
      return
    } else if (!Blockchain.chainIsValid(newChain)) {
      console.log('received invalid chain in replaceChain')
      return
    }

    console.log('replacing blockchain with new chain')
    this.chain = newChain
  }

  static chainIsValid(chain) {
    let valid = true

    let gen = chain.genesis()
    let ts = gen.timestamp
    if (JSON.stringify(gen) !== JSON.stringify(Block.genesis(ts))) {
      console.log('failed test on genesis block')
      valid = false
      return valid
    }

    for (let index = 1; index < chain.length; index++) {
      let prev = chain[index - 1]
      let block = chain[index]

      if (block.lastHash !== prev.hash) {
        console.log('failed test on matching to previous hash in chain')
        valid = false
      }

      if (block.hash !== Block.blockHash(block)) {
        console.log('failed test on hash being valid')
        valid = false
      }
    }

    return valid
  }
}

module.exports = Blockchain