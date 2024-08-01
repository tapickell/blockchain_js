const Block = require("../blockchain/block")

class Miner {
  constructor(blockchain, txPool, wallet, p2pServer) {
    this.blockchain = blockchain
    this.txPool = txPool
    this.wallet = wallet
    this.p2pServer = p2pServer
  }

  mine() {
    const validTxs = this.txPool.validTxs()
    // const reward = 1
    // const block = new Block(validTxs)
    // this.p2pServer.syncChains()
    // this.p2pServer.broadcastClear()
  }
}

module.exports = Miner