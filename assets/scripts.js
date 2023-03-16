let scannedHalos = {};

setTimeout(function () {
  document.querySelector("body").classList.add("ready");
}, 400);

let currentURL = new URL(window.location.href);

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

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

// This shit is nasty.
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

const staticHaloData = currentURL.searchParams.get("static");

// Parsing information and storing.
function prepareVerify(staticHaloData) {
  keys = parseKeys(buf2hex(staticHaloData));
  let primaryPublicKeyHash = keys["primaryPublicKeyHash"];
  keys["metadata"] = document.querySelector(".metadata-input").value;
  keys["address"] = ethers.utils.computeAddress(
    "0x" + keys["primaryPublicKeyRaw"]
  );

  // TODO: check scannedHalos as well...
  var dupeCheck = document.querySelector(
    `[data-primary="${primaryPublicKeyHash}"]`
  );

  if (!dupeCheck) {
    scannedHalos[primaryPublicKeyHash] = keys;

    const row = createRow(keys["primaryPublicKeyHash"]);

    document.querySelector(".box").appendChild(row);
    document.querySelector(".empty")?.remove();

    localStorage.setItem("halos", JSON.stringify(scannedHalos));

    document.querySelector("#clear").style.display = "flex";

    // Increment the counter
    const countEl = document.querySelector("#count");
    const count = Number(countEl.textContent);
    countEl.textContent = count + 1;
    countEl.classList.add("active");
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

if (staticHaloData) {
  prepareVerify(staticHaloData);
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

//show/hide Toggle
document.addEventListener(
  "click",
  function (event) {
    if (event.target.matches(".scan-row-header, .scan-row-header *")) {
      event.preventDefault();
      event.target.closest(".scan-row").classList.toggle("active");
    }
  },
  false
);

document.addEventListener(
  "click",
  function (event) {
    if (
      event.target.matches(".scan-row-header-remove, .scan-row-header-remove *")
    ) {
      event.preventDefault();
      const el = event.target.closest(".scan-row");
      const pk = el
        .querySelector(".scan-row-header")
        .getAttribute("data-primary");

      // Remove el
      el?.remove();

      // Remove from saved
      delete scannedHalos[pk];

      if (Object.entries(scannedHalos).length === 0) {
        document.querySelector("#clear").style.display = "none";
      }

      localStorage.setItem("halos", JSON.stringify(scannedHalos));

      // Decrement counter
      const countEl = document.querySelector("#count");
      const count = Number(countEl.textContent);
      countEl.textContent = count - 1;
      if (count === 1) countEl.classList.remove("active");
    }
  },
  false
);

document.querySelector("#clear").addEventListener("click", function () {
  if (confirm("Clear all scanned chips?")) {
    scannedHalos = {};
    localStorage.removeItem("halos");
    document.querySelectorAll(".scan-row").forEach((el) => el.remove());

    const countEl = document.querySelector("#count");
    countEl.textContent = 0;
    countEl.classList.remove("active");
    document.querySelector("#clear").style.display = "none";
  }
});

function createRow(primary) {
  const el = document.createElement("div");
  el.classList.add("scan-row");

  let metadata = scannedHalos[primary]["metadata"]
    ? scannedHalos[primary]["metadata"]
    : "";
  let signature = scannedHalos[primary]["signature"]
    ? scannedHalos[primary]["signature"]
    : "";

  if (!metadata) {
    rowTitle = primary;
    metadata = "undefined";
  } else {
    rowTitle = metadata;
  }

  el.innerHTML = `
  <header class="scan-row-header" data-primary="${primary}">
        <button class="scan-row-header-remove">
          <img src="./x.svg" />
        </button>
        <h2>
          ${rowTitle}
        </h2>
        <div class="scan-row-header-toggle">
          <img src="./chevron-down.svg" />
        </div>
      </header>

      <div class="scan-row-body">
        <div class="scan-row-body-section">
          <h3 class="scan-row-body-heading">Metadata</h3>
          <p class="scan-row-body-data">
            ${metadata}
          </p>
        </div>

        <div class="scan-row-body-section">
          <h3 class="scan-row-body-heading">Primary Public Key Hash</h3>
          <p class="scan-row-body-data">
            ${primary}
          </p>
        </div>

        <div class="scan-row-body-section">
          <h3 class="scan-row-body-heading">Signature</h3>
          <p class="scan-row-body-data">
            ${signature}
          </p>
        </div>
      </div>
  `;

  return el;
}

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
      var row = createRow(scannedHalos[halo]["primaryPublicKeyHash"]);

      document.querySelector(".box").appendChild(row);
      document.querySelector(".empty")?.remove();
      document.querySelector("#clear").style.display = "flex";
    }

    // Set counter
    const countEl = document.querySelector("#count");
    const count = Object.entries(scannedHalos).length;
    countEl.textContent = count;
    countEl.classList.add("active");
  }
} catch (err) {
  console.log(err);
}

document
  .querySelector(".metadata-input")
  .addEventListener("input", function (e) {
    document.querySelector("#sign").disabled = !e.target.value;
  });

document.addEventListener(
  "click",
  function (e) {
    const isDelete = e.target.matches(
      ".record-header-delete, .record-header-delete *"
    );

    const isHeader = e.target.matches(".record-header, .record-header *");

    if (isDelete) {
      console.log("delete");
    } else if (isHeader) {
      e.target.closest(".record").classList.toggle("active");
    }
  },
  false
);
