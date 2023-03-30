import { sha256 } from 'ethers'

export default function parseKeysCli(keys) {
  const primaryPublicKeyRaw = keys['1']
  const primaryPublicKeyHash = sha256('0x' + primaryPublicKeyRaw.slice(2))

  const secondaryPublicKeyRaw = keys['2']
  let secondaryPublicKeyHash = null

  if (keys['2']) {
    secondaryPublicKeyHash = sha256('0x' + secondaryPublicKeyRaw.slice(2))
  }

  const tertiaryPublicKeyRaw = keys['3']
  let tertiaryPublicKeyHash = null

  if (keys['3']) {
    tertiaryPublicKeyHash = sha256('0x' + tertiaryPublicKeyRaw.slice(2))
  }

  return {
    primaryPublicKeyRaw,
    primaryPublicKeyHash,
    secondaryPublicKeyRaw,
    secondaryPublicKeyHash,
    tertiaryPublicKeyRaw,
    tertiaryPublicKeyHash,
  }
}
