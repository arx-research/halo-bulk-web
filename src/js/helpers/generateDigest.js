export default function generateDigest(message, ethereumSigFormat) {
  let messageBytes = null

  if (ethereumSigFormat == 'eip191') {
    messageBytes = ethers.utils.hashMessage(message)
  } else {
    // Always fall back to EIP191.
    messageBytes = ethers.utils.hashMessage(message)
  }

  // Remove prepended 0x.
  return messageBytes.slice(2)
}
