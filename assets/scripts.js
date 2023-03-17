// State
let scannedHalos = {};
let currentURL = new URL(window.location.href);
const staticHaloData = currentURL.searchParams.get("static");

// Helper functions
const fromHexString = (hexString) => {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function parseKeys(payload) {
  primaryPublicKeyLength = parseInt("0x" + payload.slice(0, 2)) * 2;
  primaryPublicKeyRaw = payload.slice(2, primaryPublicKeyLength + 2);
  primaryPublicKeyHash = ethers.utils.sha256(
    "0x" + primaryPublicKeyRaw.slice(2)
  );

  secondaryPublicKeyLength =
    parseInt(
      "0x" +
        payload.slice(primaryPublicKeyLength + 2, primaryPublicKeyLength + 4)
    ) * 2;

  secondaryPublicKeyRaw = payload.slice(
    primaryPublicKeyLength + 4,
    primaryPublicKeyLength + secondaryPublicKeyLength + 4
  );

  secondaryPublicKeyHash = ethers.utils.sha256(
    "0x" + secondaryPublicKeyRaw.slice(2)
  );

  tertiaryPublicKeyLength =
    parseInt(
      "0x" +
        payload.slice(
          primaryPublicKeyLength + secondaryPublicKeyLength + 4,
          primaryPublicKeyLength + secondaryPublicKeyLength + 6
        )
    ) * 2;

  var tertiaryPublicKeyRaw = null;
  var tertiaryPublicKeyHash = null;

  if (tertiaryPublicKeyLength > 0) {
    tertiaryPublicKeyRaw = payload.slice(
      primaryPublicKeyLength + secondaryPublicKeyLength + 6,
      primaryPublicKeyLength +
        secondaryPublicKeyLength +
        tertiaryPublicKeyLength +
        6
    );

    tertiaryPublicKeyHash = ethers.utils.sha256(
      "0x" + tertiaryPublicKeyRaw.slice(2)
    );
  }

  const keys = {
    primaryPublicKeyHash: primaryPublicKeyHash,
    primaryPublicKeyRaw: primaryPublicKeyRaw,
    secondaryPublicKeyHash: secondaryPublicKeyHash,
    secondaryPublicKeyRaw: secondaryPublicKeyRaw,
    tertiaryPublicKeyHash: tertiaryPublicKeyHash,
    tertiaryPublicKeyRaw: tertiaryPublicKeyRaw,
  };

  return keys;
}

function unpackDERSignature(sig) {
  let header0 = sig.slice(0, 2);
  if (parseInt("0x" + header0) !== 0x30) {
    throw Error("Invalid header.");
  }

  let header_r0 = sig.slice(4, 6);
  let header_r1 = sig.slice(6, 8);

  if (parseInt("0x" + header_r0) !== 0x02) {
    throw Error("Invalid header (2).");
  }

  let length_r = parseInt("0x" + header_r1) * 2;
  let r = sig.slice(8, length_r + 8);

  let header_s0 = sig.slice(length_r + 8, length_r + 10);
  let header_s1 = sig.slice(length_r + 10, length_r + 12);

  // console.log(header_s1);

  if (parseInt("0x" + header_s0) !== 0x02) {
    throw Error("Invalid header (2).");
  }

  // console.log(length_r + 12);
  // console.log(parseInt("0x" + header_s1) * 2);
  let s = sig.slice(
    length_r + 12,
    length_r + 12 + parseInt("0x" + header_s1) * 2
  );

  // console.log(s.length);

  if (r.length == 66) {
    r = r.slice(2, 130);
  }

  if (s.length == 66) {
    s = s.slice(2, 130);
  }

  return {
    r: r,
    s: s,
  };
}

function prepareVerify(staticHaloData) {
  let keys = parseKeys(buf2hex(staticHaloData));
  let primaryPublicKeyHash = keys["primaryPublicKeyHash"];
  keys["metadata"] = document.querySelector(".metadata-input").value;
  keys["address"] = ethers.utils.computeAddress(
    "0x" + keys["primaryPublicKeyRaw"]
  );

  const recordExists = scannedHalos[primaryPublicKeyHash] !== undefined;

  if (!recordExists) {
    // Add to data object
    scannedHalos[primaryPublicKeyHash] = keys;

    // Create row html
    const row = buildRow(keys["primaryPublicKeyHash"]);

    // Append it
    document.querySelector(".records").appendChild(row);

    // Hide the empty text
    document.querySelector(".empty-text").classList.add("hide");
    document.querySelector("#export").classList.remove("hide");
    document.querySelector("#clear").classList.remove("hide");

    // Store it
    localStorage.setItem("halos", JSON.stringify(scannedHalos));

    // Display the clear all button
    document.querySelector("#clear").style.display = "flex";

    // Update counter
    updateCounter();
  }
}

// Generate a command formatted for the HaLo.
function generateCmd(cmd, keyslot, message = null, ethereumSigFormat = null) {
  let messageBytes = null;

  if (ethereumSigFormat == "eip191") {
    messageBytes = ethers.utils.hashMessage(message);
  } else {
    // Always fall back to EIP191.
    messageBytes = ethers.utils.hashMessage(message);
  }

  // Remove prepended 0x.
  let messageBytesSlice = messageBytes.slice(2);

  // Structure command bytes.
  let cmdBytes = new Uint8Array(2);
  cmdBytes[0] = cmd;
  cmdBytes[1] = keyslot;
  cmdBytes = buf2hex(cmdBytes);

  // Prepend the message with the command.
  inputBytes = cmdBytes + messageBytesSlice;

  return [inputBytes, messageBytes, ethereumSigFormat];
}

// Verify the DER encoded signature against the input message and uncompressed public key.
function verifySignature(message, signature, publicKey) {
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

async function authU2F(reqx) {
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

// This runs a command to read out the public keys.
async function readKeyU2F() {
  let res = await authU2F(fromHexString("02"));
  prepareVerify(res);
}

// Carry out a signature command against a HaLo.
async function signU2F() {
  // Generate the challenge and command bytes as 'input'.
  const challenge = document.querySelector(".metadata-input").value;
  const [input, digest, ethereumSigFormat] = generateCmd(
    1,
    1,
    challenge,
    "eip191"
  );

  // Send the input bytes.
  var req = fromHexString(input);
  var res = await authU2F(req);

  // Grab the signature response.
  const signature = buf2hex(res);

  // Strip out DER formatting to get r and s.
  const sigRaw = unpackDERSignature(signature);

  // SECP256k1 order constant
  let curveOrder =
    115792089237316195423570985008687907852837564279074904382605163141518161494337n;

  let rn = BigInt("0x" + sigRaw.r.toString("hex"));
  let sn = BigInt("0x" + sigRaw.s.toString("hex"));

  if (sn > curveOrder / 2n) {
    // malleable signature, not compliant with Ethereum's EIP-2
    // we need to flip s value in the signature
    sn = -sn + curveOrder;
  }

  let foundPrimaryPublicKeyHash = null;

  for (halo in scannedHalos) {
    // Test against 27 and 28; this only works if we have already stored the device address.
    let recover27;
    let recover28;

    try {
      recover27 = ethers.utils.recoverAddress(digest, {
        r: "0x" + rn.toString(16),
        s: "0x" + sn.toString(16),
        v: 27,
      });
    } catch (error) {
      console.error(error);
    }

    try {
      recover28 = ethers.utils.recoverAddress(digest, {
        r: "0x" + rn.toString(16),
        s: "0x" + sn.toString(16),
        v: 28,
      });
    } catch (error) {
      console.error(error);
    }

    // Recover address and compare to list.
    if (recover27 && recover27 == scannedHalos[halo]["address"]) {
      foundPrimaryPublicKeyHash = scannedHalos[halo]["primaryPublicKeyHash"];
      break;
    } else if (recover28 && recover28 == scannedHalos[halo]["address"]) {
      foundPrimaryPublicKeyHash = scannedHalos[halo]["primaryPublicKeyHash"];
      break;
    }
  }

  // TODO: add to file, post to server.
  if (foundPrimaryPublicKeyHash) {
    scannedHalos[foundPrimaryPublicKeyHash]["signature"] = signature;
    scannedHalos[foundPrimaryPublicKeyHash]["sigDigest"] = digest;
    scannedHalos[foundPrimaryPublicKeyHash]["sigMessage"] = challenge;
    scannedHalos[foundPrimaryPublicKeyHash]["sigFormat"] = ethereumSigFormat;
    localStorage.setItem("halos", JSON.stringify(scannedHalos));
  } else {
    // TODO: alert has not been scanned.
    alert("Please scan this chip first, then sign again.");
  }
}

function splitString(str) {
  const last4 = str.substr(str.length - 4);
  const rest = str.slice(0, -4);
  return { start: rest, end: last4 };
}

function buildRow(primary) {
  const record = scannedHalos[primary];
  const el = document.createElement("div");
  el.classList.add("record");
  el.setAttribute("data-primary", primary);

  const pkSplit = splitString(primary);

  el.innerHTML = `
  <div class="record-header">
    <button class="record-header-delete">
      <img src="./assets/delete.svg">
    </button>
    <div class="record-header-pk">
      <div class="record-header-pk-start">
        ${pkSplit.start}
      </div>
      <div class="record-header-pk-end">${pkSplit.end}</div>
    </div>
    <div class="record-header-chevron">
      <img src="./assets/chevron-down.svg">
    </div>
  </div>
  <div class="record-body">
    ${
      record.metadata
        ? `<div class="record-body-section">
      <h2>Metadata</h2>
      <div class="record-body-section-box">${record.metadata}</div>
    </div>`
        : ""
    }
    <div class="record-body-section">
      <h2>Primary public key</h2>
      <div class="record-body-section-box">
        ${record.primaryPublicKeyRaw}
      </div>
    </div>
    <div class="record-body-section">
      <h2>Address</h2>
      <div class="record-body-section-box">
        ${record.address}
      </div>
    </div>
  </div>
  `;

  return el;
}

function updateCounter() {
  const countEl = document.querySelector("#count");
  const count = Object.entries(scannedHalos).length;
  countEl.textContent = count;

  if (count === 0) {
    countEl.classList.add("hide");
  } else {
    countEl.classList.remove("hide");
  }
}

// Putting it all together!
if (staticHaloData) {
  prepareVerify(staticHaloData);
}

document.addEventListener(
  "click",
  function (e) {
    const isDelete = e.target.matches(
      ".record-header-delete, .record-header-delete *"
    );

    const isHeader = e.target.matches(".record-header, .record-header *");

    if (isDelete) {
      e.preventDefault();
      const el = e.target.closest(".record");
      const pk = el.getAttribute("data-primary");

      el?.remove();
      delete scannedHalos[pk];

      if (Object.entries(scannedHalos).length === 0) {
        document.querySelector("#clear").style.display = "none";
      }

      localStorage.setItem("halos", JSON.stringify(scannedHalos));

      // Decrement counter
      updateCounter();

      // Show empty text again
      if (document.querySelectorAll(".record").length === 0) {
        document.querySelector(".empty-text").classList.remove("hide");
        document.querySelector("#export").classList.add("hide");
        document.querySelector("#clear").classList.add("hide");
      }
    } else if (isHeader) {
      e.preventDefault();
      e.target.closest(".record").classList.toggle("active");
    }
  },
  false
);

document.querySelector("#clear").addEventListener("click", function () {
  if (confirm("Clear all scanned chips?")) {
    scannedHalos = {};
    localStorage.removeItem("halos");
    document.querySelectorAll(".record").forEach((el) => el.remove());

    document.querySelector("#clear").classList.add("hide");
    document.querySelector("#export").classList.add("hide");
    document.querySelector(".empty-text").classList.add("hide");

    updateCounter();
  }
});

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

document.querySelector("#export").addEventListener("click", function () {
  download(
    JSON.stringify(scannedHalos),
    `scanned-halos-${Date.now()}.json`,
    "application/json"
  );
});

// Populate from last time
try {
  const halos = localStorage.getItem("halos");

  if (halos) {
    scannedHalos = JSON.parse(halos);
  } else {
    scannedHalos = {};
  }

  if (scannedHalos && Object.entries(scannedHalos).length > 0) {
    for (halo in scannedHalos) {
      var row = buildRow(scannedHalos[halo]["primaryPublicKeyHash"]);
      document.querySelector(".records").appendChild(row);
    }

    document.querySelector("#clear").classList.remove("hide");
    document.querySelector("#export").classList.remove("hide");
    document.querySelector(".empty-text").classList.add("hide");

    // Set counter
    updateCounter();
  }
} catch (err) {
  console.log(err);
}

document
  .querySelector(".metadata-input")
  .addEventListener("input", function (e) {
    document.querySelector("#sign").disabled = !e.target.value;
  });
