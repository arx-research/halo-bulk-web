import './js/ws'

import {
  authU2F,
  buf2hex,
  download,
  fromHexString,
  generateCmd,
  parseKeys,
  splitHash,
  unpackDERSignature,
} from './js/helpers'
import wsp from './js/ws'
import parseKeysCli from './js/helpers/parseKeysCli'
import { execHaloCmdWeb } from '@arx-research/libhalo'
import generateDigest from './js/helpers/generateDigest'

// State
let scannedHalos = {}
let currentURL = new URL(window.location.href)
const staticHaloData = currentURL.searchParams.get('static')

function prepareVerify(staticHaloData, publicKeys) {
  let keys = publicKeys ? parseKeysCli(publicKeys) : parseKeys(buf2hex(staticHaloData))

  let primaryPublicKeyHash = keys['primaryPublicKeyHash']
  keys['metadata'] = document.querySelector('.metadata-input').value
  keys['address'] = ethers.utils.computeAddress('0x' + keys['primaryPublicKeyRaw'])

  const recordExists = scannedHalos[primaryPublicKeyHash] !== undefined

  if (!recordExists) {
    // Add to data object
    scannedHalos[primaryPublicKeyHash] = keys

    // Create row html
    const row = buildRow(keys['primaryPublicKeyHash'])

    // Append it
    document.querySelector('.records').appendChild(row)

    // Hide the empty text
    document.querySelector('.empty-text').classList.add('hide')
    document.querySelector('#export').classList.remove('hide')
    document.querySelector('#clear').classList.remove('hide')

    // Store it
    localStorage.setItem('halos', JSON.stringify(scannedHalos))

    // Display the clear all button
    document.querySelector('#clear').style.display = 'flex'

    // Update counter
    updateCounter()
  }
}

// This runs a command to read out the public keys.
async function readKeyU2F() {
  let res = await authU2F(fromHexString('02'))
  prepareVerify(res)
}

// Carry out a signature command against a HaLo.
async function signU2F() {
  const challenge = document.querySelector('.metadata-input').value

  let command = {
    name: 'sign',
    keyNo: 1,
    digest: generateDigest(challenge),
  }

  try {
    let res = await execHaloCmdWeb(command)
    // display operation result
    document.getElementById('console').innerText = JSON.stringify(res, null, 4)
  } catch (e) {
    // display error
    document.getElementById('console').innerText = e
  }

  console.log(command)

  // document.getElementById('statusText').innerText = 'Please tap NFC tag to the back of your smartphone...'

  // try {
  //   let res = await execHaloCmdWeb(command)
  //   // display operation result
  //   document.getElementById('statusText').innerText = JSON.stringify(res, null, 4)
  // } catch (e) {
  //   // display error
  //   document.getElementById('statusText').innerText = e
  // }

  // // Get the text they
  // const challenge = document.querySelector('.metadata-input').value

  // // Generate the challenge and command bytes as 'input'.
  // const [input, digest, ethereumSigFormat] = generateCmd(1, 1, challenge, 'eip191')

  // // Send the input bytes.
  // var req = fromHexString(input)
  // var res = await authU2F(req)

  // // Grab the signature response.
  // const signature = buf2hex(res)

  // // Strip out DER formatting to get r and s.
  // const sigRaw = unpackDERSignature(signature)

  // // SECP256k1 order constant
  // let curveOrder = 115792089237316195423570985008687907852837564279074904382605163141518161494337n

  // let rn = BigInt('0x' + sigRaw.r.toString('hex'))
  // let sn = BigInt('0x' + sigRaw.s.toString('hex'))

  // if (sn > curveOrder / 2n) {
  //   // malleable signature, not compliant with Ethereum's EIP-2
  //   // we need to flip s value in the signature
  //   sn = -sn + curveOrder
  // }

  // let foundPrimaryPublicKeyHash = null

  // for (halo in scannedHalos) {
  //   // Test against 27 and 28; this only works if we have already stored the device address.
  //   let recover27
  //   let recover28

  //   try {
  //     recover27 = ethers.utils.recoverAddress(digest, {
  //       r: '0x' + rn.toString(16),
  //       s: '0x' + sn.toString(16),
  //       v: 27,
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   try {
  //     recover28 = ethers.utils.recoverAddress(digest, {
  //       r: '0x' + rn.toString(16),
  //       s: '0x' + sn.toString(16),
  //       v: 28,
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   // Recover address and compare to list.
  //   if (recover27 && recover27 == scannedHalos[halo]['address']) {
  //     foundPrimaryPublicKeyHash = scannedHalos[halo]['primaryPublicKeyHash']
  //     break
  //   } else if (recover28 && recover28 == scannedHalos[halo]['address']) {
  //     foundPrimaryPublicKeyHash = scannedHalos[halo]['primaryPublicKeyHash']
  //     break
  //   }
  // }

  // // TODO: add to file, post to server.
  // if (foundPrimaryPublicKeyHash) {
  //   scannedHalos[foundPrimaryPublicKeyHash]['signature'] = signature
  //   scannedHalos[foundPrimaryPublicKeyHash]['sigDigest'] = digest
  //   scannedHalos[foundPrimaryPublicKeyHash]['sigMessage'] = challenge
  //   scannedHalos[foundPrimaryPublicKeyHash]['sigFormat'] = ethereumSigFormat
  //   localStorage.setItem('halos', JSON.stringify(scannedHalos))

  //   alert('sign successful?')
  // } else {
  //   // TODO: alert has not been scanned.
  //   alert('Please scan this chip first, then sign again.')
  // }
}

function buildRow(primary) {
  const record = scannedHalos[primary]
  const el = document.createElement('div')
  el.classList.add('record')
  el.setAttribute('data-primary', primary)

  const pkSplit = splitHash(primary)

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
        : ''
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
  `

  return el
}

function updateCounter() {
  const countEl = document.querySelector('#count')
  const count = Object.entries(scannedHalos).length
  countEl.textContent = count

  if (count === 0) {
    countEl.classList.add('hide')
  } else {
    countEl.classList.remove('hide')
  }
}

// Putting it all together!
if (staticHaloData) {
  prepareVerify(staticHaloData)
}

document.querySelector('#scan').addEventListener('click', () => {
  readKeyU2F()
})

document.querySelector('#sign').addEventListener('click', () => {
  signU2F()
})

document.addEventListener(
  'click',
  function (e) {
    const isDelete = e.target.matches('.record-header-delete, .record-header-delete *')

    const isHeader = e.target.matches('.record-header, .record-header *')

    if (isDelete) {
      e.preventDefault()
      const el = e.target.closest('.record')
      const pk = el.getAttribute('data-primary')

      el?.remove()
      delete scannedHalos[pk]

      if (Object.entries(scannedHalos).length === 0) {
        document.querySelector('#clear').style.display = 'none'
      }

      localStorage.setItem('halos', JSON.stringify(scannedHalos))

      // Decrement counter
      updateCounter()

      // Show empty text again
      if (document.querySelectorAll('.record').length === 0) {
        document.querySelector('.empty-text').classList.remove('hide')
        document.querySelector('#export').classList.add('hide')
        document.querySelector('#clear').classList.add('hide')
      }
    } else if (isHeader) {
      e.preventDefault()
      e.target.closest('.record').classList.toggle('active')
    }
  },
  false
)

document.querySelector('#clear').addEventListener('click', function () {
  if (confirm('Clear all scanned chips?')) {
    scannedHalos = {}
    localStorage.removeItem('halos')
    document.querySelectorAll('.record').forEach((el) => el.remove())

    document.querySelector('#clear').classList.add('hide')
    document.querySelector('#export').classList.add('hide')
    document.querySelector('.empty-text').classList.add('hide')

    updateCounter()
  }
})

document.querySelector('#export').addEventListener('click', function () {
  download(JSON.stringify(scannedHalos), `scanned-halos-${Date.now()}.json`, 'application/json')
})

// Populate from last time
try {
  const halos = localStorage.getItem('halos')

  if (halos) {
    scannedHalos = JSON.parse(halos)
  } else {
    scannedHalos = {}
  }

  if (scannedHalos && Object.entries(scannedHalos).length > 0) {
    for (halo in scannedHalos) {
      var row = buildRow(scannedHalos[halo]['primaryPublicKeyHash'])
      document.querySelector('.records').appendChild(row)
    }

    document.querySelector('#clear').classList.remove('hide')
    document.querySelector('#export').classList.remove('hide')
    document.querySelector('.empty-text').classList.add('hide')

    // Set counter
    updateCounter()
  }
} catch (err) {
  console.log(err)
}

document.querySelector('.metadata-input').addEventListener('input', function (e) {
  document.querySelector('#sign').disabled = !e.target.value
})

// Webhook stuff
async function processTag(handle) {
  let res = await wsp.sendRequest({
    type: 'exec_halo',
    handle: handle,
    command: {
      name: 'get_pkeys',
    },
  })

  if (res.event === 'exec_exception') {
    console.log('!!! ERROR !!! Failed to execute HaLo command.')
  }

  // Keys here
  if (res?.data?.res?.publicKeys) {
    prepareVerify(null, res.data.res.publicKeys)
  }

  res = await wsp.sendRequest({
    type: 'exec_halo',
    handle: handle,
    command: {
      name: 'sign',
      message: '010203',
      keyNo: 1,
    },
  })

  if (res.event === 'exec_exception') {
    console.log('!!! ERROR !!! Failed to execute HaLo command.')
  }

  // console.log(JSON.stringify(res))
}

let readerMode = false

// Listen to events
wsp.onUnpackedMessage.addListener(async (ev) => {
  if (ev.event === 'ws_connected') {
    readerMode = true
  }

  if (ev.event !== 'exec_success' && ev.event !== 'exec_exception') {
    // console.log(JSON.stringify(ev))
  }

  if (ev.event === 'handle_added') {
    await processTag(ev.data.handle)
  }
})

wsp.onClose.addListener((event) => {
  if (event.code === 4001) {
    console.log('Connection closed, new client has connected.')
  } else {
    console.log('Connection closed: ' + event.code)
  }
})

wsp.open()
