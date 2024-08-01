const Transaction = require("./transaction")

class TransactionPool {
  constructor() {
    this.transactions = []
  }

  upsertTx(tx) {
    let { index: i, tx: matchingTx } = this.byIdWithIndex(tx.id)

    if (matchingTx) {
      this.transactions[i] = tx
    } else {
      this.transactions.push(tx)
    }
  }

  upsertTxByAddress(tx, address) {
    let matchingTx = this.byAddress(address)
    let [wallet, recip, amount] = tx

    if (matchingTx) {
      matchingTx.update(wallet, recip, amount)
      // console.log(`matchingTx: ${matchingTx}`)
      return matchingTx
    } else {
      let newTx = Transaction.newTx(wallet, recip, amount)
      // this.transactions.push(newTx)
      this.upsertTx(newTx)
      // console.log(`upserted: ${JSON.stringify(this.transactions.map((tx, i, arr) => tx.outputs))}`)
      return newTx
    }
  }

  byIdWithIndex(id) {
    let tx = this.transactions.find(tx => tx.id === id)
    if (tx) {
      return { index: this.transactions.indexOf(tx), tx: tx }
    } else {
      return { index: null, tx: null }
    }
  }

  byId(id) {
    let { index: i, tx: matchingTx } = this.byIdWithIndex(id)
    return matchingTx
  }

  byAddressWithIndex(address) {
    // console.log(`TXS: ${JSON.stringify(this.transactions)}`)
    let tx = this.transactions.find(tx => tx.input.address === address)
    if (tx) {
      return { index: this.transactions.indexOf(tx), tx: tx }
    } else {
      return { index: null, tx: null }
    }
  }

  byAddress(address) {
    let { index: i, tx: matchingTx } = this.byAddressWithIndex(address)
    return matchingTx
  }

  outputTotal() {
    return this.transactions.outputs.reduce((total, output) => {
      return total, output.amount
    }, 0)
  }

  validTxs() {
    const outputTotal = outputTotal()
    return this.transactions.filter(tx => tx.valid(outputTotal))
  }
}

module.exports = TransactionPool