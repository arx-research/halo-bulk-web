import buf2hex from './buf2hex'

// Generate a command formatted for the HaLo.
export default function generateCmd(cmd, keyslot, message = null, ethereumSigFormat = null) {
  let messageBytes = null

  if (ethereumSigFormat == 'eip191') {
    messageBytes = ethers.utils.hashMessage(message)
  } else {
    // Always fall back to EIP191.
    messageBytes = ethers.utils.hashMessage(message)
  }

  // Remove prepended 0x.
  let messageBytesSlice = messageBytes.slice(2)

  // Structure command bytes.
  let cmdBytes = new Uint8Array(2)
  cmdBytes[0] = cmd
  cmdBytes[1] = keyslot
  cmdBytes = buf2hex(cmdBytes)

  // Prepend the message with the command.
  inputBytes = cmdBytes + messageBytesSlice

  return [inputBytes, messageBytes, ethereumSigFormat]
}
