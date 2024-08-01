const ChainUtil = require('./chain_util')

class Transaction {
  constructor() {
    this.uuid = ChainUtil.uuid()
    this.input = null
    this.outputs = []
  }

  outputByAddress(address) {
    return this.outputs.find(o => o.address === address)
  }

  outputsByAddress(address) {
    return this.outputs.filter(o => o.address === address)
  }

  update(senderWallet, recipient, amount) {
    const senderOut = this.outputByAddress(senderWallet.publicKey)

    if (amount > senderOut.amount) {
      console.log(`Amount ${amount} exceeds balance.`)
      return
    }

    senderOut.amount = senderOut.amount - amount
    this.outputs.push({ amount, address: recipient })
    Transaction.signature(this, senderWallet)

    return this
  }

  valid(outputTotal) {
    if (this.input.amount !== outputTotal) {
      console.log(`Invalid tx from ${this.input.address}`)
      return false
    }
    if (!this.verifyTx(this)) {
      console.log(`Invalid signature from ${this.input.address}`)
      return false
    }
    return true
  }

  static newTx(senderWallet, recipient, amount) {
    const transaction = new this()

    if (amount > senderWallet.balance) {
      console.log(`Amount ${amount} exceeds balance.`)
      return
    }

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ])

    transaction.input = this.signature(transaction, senderWallet)

    return transaction
  }

  static hashedTx(tx) {
    let outs = JSON.stringify(tx.outputs)
    return ChainUtil.hash(outs)
  }

  static signature(tx, senderWallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(this.hashedTx(tx))
    }
  }

  static verifyTx(tx) {
    return ChainUtil.verifySignature(
      tx.input.address,
      tx.input.signature,
      this.hashedTx(tx)
    )
  }
}

module.exports = Transaction