const ChainUtil = require('./chain_util')
const Transaction = require('./transaction')
const { INITIAL_BALANCE } = require('../../config')

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode('hex')
  }

  toString() {
    return `Wallet -
    publicKey: ${this.publicKey.toString()}
    balance: ${this.balance}
    -
    `
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash)
  }

  createTx(recip, amount, txPool) {
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`)
      return
    }

    let newTx = [this, recip, amount]
    return txPool.upsertTxByAddress(newTx, this.publicKey)
  }
}

module.exports = Wallet