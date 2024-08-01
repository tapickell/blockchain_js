const Ws = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  tx: 'TX'
}

class P2pServer {
  constructor(blockchain, txPool) {
    this.blockchain = blockchain
    this.txPool = txPool
    this.sockets = []
  }

  listen() {
    const server = new Ws.Server({ port: P2P_PORT })
    server.on('connection', socket => this.connectSocket(socket))
    this.connectToPeers()
    console.log(`Listening on peer-to-peer on: ${P2P_PORT}`)
  }

  connectSocket(socket) {
    this.sockets.push(socket)
    this.messageHandler(socket)
    console.log('Socket connected')
    this.sendChain(socket)
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Ws(peer)
      socket.on('open', () => this.connectSocket(socket))
    });
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const msg = JSON.parse(message)
      console.log('data', msg.data)
      switch (msg.type) {
        case MESSAGE_TYPES.chain:
          this.handleChainMsg(msg)
          break
        case MESSAGE_TYPES.tx:
          this.handleTxMsg(msg)
          break
      }
    })
  }

  handleChainMsg(msg) {
    this.blockchain.replaceChain(msg.data)
  }

  handleTxMsg(msg) {
    this.txPool.upsertTx(msg.data)
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      data: this.blockchain.fullChain()
    }))
  }

  syncChains() {
    this.sockets.forEach(socket => {
      this.sendChain(socket)
    })
  }

  sendTx(socket, tx) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.tx,
      data: tx
    }))
  }

  broadcastTx(tx) {
    this.sockets.forEach(s => this.sendTx(s, tx))
  }
}

module.exports = P2pServer