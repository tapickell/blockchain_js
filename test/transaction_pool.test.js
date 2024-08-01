const TxPool = require('../src/crypto/transaction_pool')
const Tx = require('../src/crypto/transaction')
const Wallet = require('../src/crypto/wallet')

describe('TxPool', () => {
  it('', () => {
    let tpool = new TxPool()
    let wallet = new Wallet()
    let tx = Tx.newTx(wallet, 'recip', 30)
    tpool.upsertTx(tx)
  })

  it('adds a tx to the pool', () => {
    let tpool = new TxPool()
    let wallet = new Wallet()
    let tx = Tx.newTx(wallet, 'recip', 30)
    tpool.upsertTx(tx)

    let foundTx = tpool.byId(tx.id)
    expect(foundTx).toEqual(tx)
  })

  it('updates a tx in the pool', () => {
    let tpool = new TxPool()
    let wallet = new Wallet()
    let tx = Tx.newTx(wallet, 'recip', 30)
    tpool.upsertTx(tx)

    let oldTx = JSON.stringify(tx)
    let newTx = tx.update(wallet, 'recip2', 40)
    tpool.upsertTx(newTx)

    let foundTx = JSON.stringify(tpool.byId(newTx.id))
    expect(foundTx).not.toEqual(oldTx)
  })

})