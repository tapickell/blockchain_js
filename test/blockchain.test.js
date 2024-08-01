const Blockchain = require('../src/blockchain/blockchain')
const Block = require('../src/blockchain/block')

describe('Blockchain', () => {
  it('start with genesis', () => {
    blockchain = new Blockchain()
    let gen = blockchain.head()

    expect(gen.data).toEqual('alpha')
    expect(gen.lastHash).toEqual("0b4e962416bc9ccf1a6fb446cf09e4788eb10579c7d607e860d3b79c99fa3a52")
  })

  it('adds a new block', () => {
    const data = "dataz"
    blockchain = new Blockchain()
    let gen = blockchain.head()
    blockchain.addBlock(data)
    let added = blockchain.head()

    expect(added.data).toEqual(data)
    expect(added.lastHash).toEqual(gen.hash)
  })

  it('validates a valid chain', () => {
    const data = "dataz"
    blockchain = new Blockchain()
    blockchain.addBlock(data)

    expect(Blockchain.chainIsValid(blockchain)).toBe(true)
  })

  it('catches an invalid chain with a corrupt genesis block', () => {
    const data = "dataz"
    blockchain = new Blockchain()
    blockchain.addBlock(data)
    blockchain.chain[0].data = 'Bad Data'

    expect(Blockchain.chainIsValid(blockchain)).toBe(false)
  })

  it('catches an invalid chain with corrupt block', () => {
    const data = "dataz"
    blockchain = new Blockchain()
    blockchain.addBlock(data)
    blockchain.chain[1].data = 'Corrupted Data'

    expect(Blockchain.chainIsValid(blockchain)).toBe(false)
  })

  it('catches an invalid chain with corrupt prev hash', () => {
    const data = "dataz"
    blockchain = new Blockchain()
    blockchain.addBlock(data)
    blockchain.chain[1].lastHash = 'Corrupted hash'

    expect(Blockchain.chainIsValid(blockchain)).toBe(false)
  })

  it('replaces with a longer valid chain', () => {
    blockchain = new Blockchain()
    blockchain.addBlock("dataz")

    blockchain2 = new Blockchain()
    blockchain2.addBlock("dataz")
    blockchain2.addBlock("moar dataz")
    blockchain2.addBlock("dataz again")

    blockchain.replaceChain(blockchain2)
    console.log("WTF", blockchain)
    expect(blockchain.chainLength()).toEqual(4)
    expect(blockchain.chain).toEqual(blockchain2.chain)
  })

  it('does not replaces with a same length valid chain', () => {
    blockchain = new Blockchain()
    blockchain.addBlock("dataz")
    blockchain.addBlock("moar dataz")

    blockchain2 = new Blockchain()
    blockchain2.addBlock("dataz")
    blockchain2.addBlock("other dataz")

    blockchain.replaceChain(blockchain2)
    expect(blockchain.chain).not.toEqual(blockchain2.chain)
  })

  it('does not replaces with a smaller length valid chain', () => {
    blockchain = new Blockchain()
    blockchain.addBlock("dataz")
    blockchain.addBlock("moar dataz")

    blockchain2 = new Blockchain()
    blockchain2.addBlock("other dataz")

    blockchain.replaceChain(blockchain2)
    expect(blockchain.chain).not.toEqual(blockchain2.chain)
  })
})