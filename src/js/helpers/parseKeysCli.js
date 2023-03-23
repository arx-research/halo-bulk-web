export default function parseKeysCli(keys) {
  const primaryPublicKeyRaw = keys['1']
  const primaryPublicKeyHash = ethers.utils.sha256('0x' + primaryPublicKeyRaw.slice(2))
  const secondaryPublicKeyRaw = keys['2']
  const secondaryPublicKeyHash = ethers.utils.sha256('0x' + secondaryPublicKeyRaw.slice(2))
  let tertiaryPublicKeyRaw = keys['3']
  let tertiaryPublicKeyHash = null

  if (keys['3']) {
    tertiaryPublicKeyHash = ethers.utils.sha256('0x' + tertiaryPublicKeyRaw.slice(2))
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
