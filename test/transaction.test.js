const Transaction = require('../src/crypto/transaction')
const Wallet = require('../src/crypto/wallet')

describe('Transaction', () => {
  it('inputs the balance of the wallet', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)

    expect(tx.input.amount).toEqual(wallet.balance)
  })

  it('tx exceeds wallet balance', () => {
    let wallet = new Wallet()
    let amount = 50000
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)

    expect(tx).toEqual(undefined)
  })

  it('wallet output balance - amount', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)

    let wallet_output = tx.outputByAddress(wallet.publicKey)
    expect(wallet_output.amount).toEqual(wallet.balance - amount)
  })

  it('recip output amount', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)

    let recip_output = tx.outputByAddress(recip)
    expect(recip_output.amount).toEqual(amount)
  })

  it('validates valid tx', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)

    expect(Transaction.verifyTx(tx)).toBe(true)
  })

  it('in-validates in-valid tx', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)
    tx.outputs[0].amount = 500000

    expect(Transaction.verifyTx(tx)).toBe(false)
  })

  it('update TX - subtracts next amount from output', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)
    let nextAmount = 20
    let nextRecip = 'nextRecip'
    tx = tx.update(wallet, nextRecip, nextAmount)

    let senderOut = tx.outputByAddress(wallet.publicKey)
    expect(senderOut.amount).toEqual(wallet.balance - amount - nextAmount)
  })

  it('update TX - output amount for nextRecip', () => {
    let wallet = new Wallet()
    let amount = 50
    let recip = 'recip'
    let tx = Transaction.newTx(wallet, recip, amount)
    let nextAmount = 20
    let nextRecip = 'nextRecip'
    tx = tx.update(wallet, nextRecip, nextAmount)

    let recip_output = tx.outputByAddress(nextRecip)
    expect(recip_output.amount).toEqual(nextAmount)
  })
})