const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const { v1: uuidV1 } = require('uuid')
const crypto = require('crypto')

class ChianUtil {
  static genKeyPair() {
    return ec.genKeyPair()
  }

  static uuid() {
    return uuidV1()
  }

  static hash(data) {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
  }

  static verifySignature(pubKey, signature, dataHash) {
    return ec.keyFromPublic(pubKey, 'hex').verify(dataHash, signature)
  }
}

module.exports = ChianUtil