const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('../src/blockchain/blockchain')
const P2P = require('./p2p_server')
const Wallet = require('../src/crypto/wallet')
const TxPool = require('../src/crypto/transaction_pool')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const blockchain = new Blockchain()
const wallet = new Wallet()
const txPool = new TxPool()
const p2pServer = new P2P(blockchain, txPool)

app.use(bodyParser.json())

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

app.get('/blocks', (req, res) => {
  res.json(blockchain.fullChain())
})

app.get('/transactions', (req, res) => {
  res.json(txPool.transactions)
})

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body
  const tx = wallet.createTx(recipient, amount, txPool)
  p2pServer.broadcastTx(tx)
  res.redirect('/transactions')
})

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data)
  console.log(`New block added: ${block.toString()}`)
  p2pServer.syncChains()
  res.redirect('/blocks')
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()