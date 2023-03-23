export default async function authU2F(reqx) {
  var req = {
    publicKey: {
      allowCredentials: [
        {
          id: reqx,
          transports: ["nfc"],
          type: "public-key",
        },
      ],
      challenge: new Uint8Array([
        113, 241, 176, 49, 249, 113, 39, 237, 135, 170, 177, 61, 15, 14, 105,
        236, 120, 140, 4, 41, 65, 225, 107, 63, 214, 129, 133, 223, 169, 200,
        21, 88,
      ]),
      rpId: window.location.host,
      timeout: 60000,
      userVerification: "discouraged",
    },
  };

  var xdd = await navigator.credentials.get(req);
  return xdd.response.signature;
}