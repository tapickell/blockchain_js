const Wallet = require('../src/crypto/wallet')
const TxPool = require('../src/crypto/transaction_pool')

describe('wallet add tx to pool creating a tx', () => {
  it('same tx doubles sendAmount', () => {
    let wallet = new Wallet()
    let txpool = new TxPool()
    let sendAmount = 50
    let recip = 'recip'
    let tx = wallet.createTx(recip, sendAmount, txpool)

    let tx2 = wallet.createTx(recip, sendAmount, txpool)

    let out = tx.outputByAddress(wallet.publicKey)
    expect(out.amount).toEqual(wallet.balance - sendAmount * 2)
  })

  it('clones sendAmount output for recip', () => {
    let wallet = new Wallet()
    let txpool = new TxPool()
    let sendAmount = 50
    let recip = 'recip'
    let tx = wallet.createTx(recip, sendAmount, txpool)

    let tx2 = wallet.createTx(recip, sendAmount, txpool)

    let outs = tx.outputsByAddress(recip)
    let amounts = outs.map(o => o.amount)
    expect(amounts).toEqual([sendAmount, sendAmount])
  })
})

