export default function parseKeys(payload) {
  primaryPublicKeyLength = parseInt('0x' + payload.slice(0, 2)) * 2
  primaryPublicKeyRaw = payload.slice(2, primaryPublicKeyLength + 2)
  primaryPublicKeyHash = ethers.utils.sha256('0x' + primaryPublicKeyRaw.slice(2))

  secondaryPublicKeyLength = parseInt('0x' + payload.slice(primaryPublicKeyLength + 2, primaryPublicKeyLength + 4)) * 2

  secondaryPublicKeyRaw = payload.slice(
    primaryPublicKeyLength + 4,
    primaryPublicKeyLength + secondaryPublicKeyLength + 4
  )

  secondaryPublicKeyHash = ethers.utils.sha256('0x' + secondaryPublicKeyRaw.slice(2))

  tertiaryPublicKeyLength =
    parseInt(
      '0x' +
        payload.slice(
          primaryPublicKeyLength + secondaryPublicKeyLength + 4,
          primaryPublicKeyLength + secondaryPublicKeyLength + 6
        )
    ) * 2

  var tertiaryPublicKeyRaw = null
  var tertiaryPublicKeyHash = null

  if (tertiaryPublicKeyLength > 0) {
    tertiaryPublicKeyRaw = payload.slice(
      primaryPublicKeyLength + secondaryPublicKeyLength + 6,
      primaryPublicKeyLength + secondaryPublicKeyLength + tertiaryPublicKeyLength + 6
    )

    tertiaryPublicKeyHash = ethers.utils.sha256('0x' + tertiaryPublicKeyRaw.slice(2))
  }

  const keys = {
    primaryPublicKeyHash: primaryPublicKeyHash,
    primaryPublicKeyRaw: primaryPublicKeyRaw,
    secondaryPublicKeyHash: secondaryPublicKeyHash,
    secondaryPublicKeyRaw: secondaryPublicKeyRaw,
    tertiaryPublicKeyHash: tertiaryPublicKeyHash,
    tertiaryPublicKeyRaw: tertiaryPublicKeyRaw,
  }

  return keys
}
