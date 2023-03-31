// Verify the DER encoded signature against the input message and uncompressed public key.
export default function verifySignature(message, signature, publicKey) {
  console.log(`digest: ${message}`);
  console.log(`signature: ${signature}`);
  console.log(`publicKey: ${publicKey}`);

  // Compute the Ethereum address from the publicKey.
  const computedAddress = ethers.utils.computeAddress("0x" + publicKey);

  // Strip out DER formatting to get r and s.
  const sigRaw = unpackDERSignature(signature);

  // We generate DER signatures, not RLP. As such we do not have the v parameter and must ascertain it.
  let vByte = new Uint8Array(1);
  vByte[0] = 27;
  const vByte0 = buf2hex(vByte);
  vByte[0] = 28;
  const vByte1 = buf2hex(vByte);

  // Test which byte was used in the message.
  switch (computedAddress) {
    case ethers.utils.verifyMessage(
      message,
      "0x" + sigRaw.r + sigRaw.s + vByte0
    ):
      return true;
    case ethers.utils.verifyMessage(
      message,
      "0x" + sigRaw.r + sigRaw.s + vByte1
    ):
      return true;
    default:
      return false;
  }
}