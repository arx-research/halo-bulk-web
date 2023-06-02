import { hashMessage } from 'ethers'

export default function GenerateDigest(message) {
  let messageBytes = hashMessage(message)
  return messageBytes.slice(2)
}
