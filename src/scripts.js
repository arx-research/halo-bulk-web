import './js/ws'
import WebSocketAsPromised from 'websocket-as-promised'

import {
  authU2F,
  buf2hex,
  download,
  fromHexString,
  generateCmd,
  parseKeys,
  splitHash,
  unpackDERSignature,
  parseKeysCli,
} from './js/helpers'
// import wsp from './js/ws'
// import parseKeysCli from './js/helpers/parseKeysCli'
// import { execHaloCmdWeb } from '@arx-research/libhalo'
// import generateDigest from './js/helpers/generateDigest'

// // State
// let scannedHalos = {}
// let currentURL = new URL(window.location.href)
// const staticHaloData = currentURL.searchParams.get('static')

// // This runs a command to read out the public keys.
// async function readKeyU2F() {
//   let res = await authU2F(fromHexString('02'))
//   prepareVerify(res)
// }

// // Carry out a signature command against a HaLo.
// async function signU2F() {
//   const challenge = document.querySelector('.metadata-input').value

//   let command = {
//     name: 'sign',
//     keyNo: 1,
//     digest: generateDigest(challenge),
//   }

//   try {
//     let res = await execHaloCmdWeb(command)
//     // display operation result
//     document.getElementById('console').innerText = JSON.stringify(res, null, 4)
//   } catch (e) {
//     // display error
//     document.getElementById('console').innerText = e
//   }
// }

// function buildRow(primary) {
//   const record = scannedHalos[primary]
//   const el = document.createElement('div')
//   el.classList.add('record')
//   el.setAttribute('data-primary', primary)

//   const pkSplit = splitHash(primary)

//   el.innerHTML = `
//   <div class="record-header">
//     <button class="record-header-delete">
//       <img src="./assets/delete.svg">
//     </button>
//     <div class="record-header-pk">
//       <div class="record-header-pk-start">
//         ${pkSplit.start}
//       </div>
//       <div class="record-header-pk-end">${pkSplit.end}</div>
//     </div>
//     <div class="record-header-chevron">
//       <img src="./assets/chevron-down.svg">
//     </div>
//   </div>
//   <div class="record-body">
//     ${
//       record.metadata
//         ? `<div class="record-body-section">
//       <h2>Metadata</h2>
//       <div class="record-body-section-box">${record.metadata}</div>
//     </div>`
//         : ''
//     }
//     <div class="record-body-section">
//       <h2>Primary public key</h2>
//       <div class="record-body-section-box">
//         ${record.primaryPublicKeyRaw}
//       </div>
//     </div>
//     <div class="record-body-section">
//       <h2>Address</h2>
//       <div class="record-body-section-box">
//         ${record.address}
//       </div>
//     </div>
//   </div>
//   `

//   return el
// }

// function updateCounter() {
//   const countEl = document.querySelector('#count')
//   const count = Object.entries(scannedHalos).length
//   countEl.textContent = count

//   if (count === 0) {
//     countEl.classList.add('hide')
//   } else {
//     countEl.classList.remove('hide')
//   }
// }

// // Putting it all together!
// if (staticHaloData) {
//   prepareVerify(staticHaloData)
// }

// document.querySelector('#scan').addEventListener('click', () => {
//   readKeyU2F()
// })

// document.querySelector('#sign').addEventListener('click', () => {
//   signU2F()
// })

// document.addEventListener(
//   'click',
//   function (e) {
//     const isDelete = e.target.matches('.record-header-delete, .record-header-delete *')

//     const isHeader = e.target.matches('.record-header, .record-header *')

//     if (isDelete) {
//       e.preventDefault()
//       const el = e.target.closest('.record')
//       const pk = el.getAttribute('data-primary')

//       el?.remove()
//       delete scannedHalos[pk]

//       if (Object.entries(scannedHalos).length === 0) {
//         document.querySelector('#clear').style.display = 'none'
//       }

//       localStorage.setItem('halos', JSON.stringify(scannedHalos))

//       // Decrement counter
//       updateCounter()

//       // Show empty text again
//       if (document.querySelectorAll('.record').length === 0) {
//         document.querySelector('.empty-text').classList.remove('hide')
//         document.querySelector('#export').classList.add('hide')
//         document.querySelector('#clear').classList.add('hide')
//       }
//     } else if (isHeader) {
//       e.preventDefault()
//       e.target.closest('.record').classList.toggle('active')
//     }
//   },
//   false
// )

// document.querySelector('#clear').addEventListener('click', function () {
//   if (confirm('Clear all scanned chips?')) {
//     scannedHalos = {}
//     localStorage.removeItem('halos')
//     document.querySelectorAll('.record').forEach((el) => el.remove())

//     document.querySelector('#clear').classList.add('hide')
//     document.querySelector('#export').classList.add('hide')
//     document.querySelector('.empty-text').classList.add('hide')

//     updateCounter()
//   }
// })

// document.querySelector('#export').addEventListener('click', function () {
//   download(JSON.stringify(scannedHalos), `scanned-halos-${Date.now()}.json`, 'application/json')
// })

// // Populate from last time
// try {
//   const halos = localStorage.getItem('halos')

//   if (halos) {
//     scannedHalos = JSON.parse(halos)
//   } else {
//     scannedHalos = {}
//   }

//   if (scannedHalos && Object.entries(scannedHalos).length > 0) {
//     for (halo in scannedHalos) {
//       var row = buildRow(scannedHalos[halo]['primaryPublicKeyHash'])
//       document.querySelector('.records').appendChild(row)
//     }

//     document.querySelector('#clear').classList.remove('hide')
//     document.querySelector('#export').classList.remove('hide')
//     document.querySelector('.empty-text').classList.add('hide')

//     // Set counter
//     updateCounter()
//   }
// } catch (err) {
//   console.log(err)
// }

// document.querySelector('.metadata-input').addEventListener('input', function (e) {
//   document.querySelector('#sign').disabled = !e.target.value
// })

// // Webhook stuff
// async function processTag(handle) {
//   let res = await wsp.sendRequest({
//     type: 'exec_halo',
//     handle: handle,
//     command: {
//       name: 'get_pkeys',
//     },
//   })

//   if (res.event === 'exec_exception') {
//     console.log('!!! ERROR !!! Failed to execute HaLo command.')
//   }

//   // Keys here
//   if (res?.data?.res?.publicKeys) {
//     prepareVerify(null, res.data.res.publicKeys)
//   }

//   res = await wsp.sendRequest({
//     type: 'exec_halo',
//     handle: handle,
//     command: {
//       name: 'sign',
//       message: prompt('enter your random stuff'),
//       keyNo: 1,
//     },
//   })

//   console.log(res)

//   if (res.event === 'exec_exception') {
//     console.log('!!! ERROR !!! Failed to execute HaLo command.')
//   }

//   // console.log(JSON.stringify(res))
// }

// // Listen to events
// wsp.onUnpackedMessage.addListener(async (ev) => {
//   if (ev.event === 'ws_connected') {
//     readerMode = true
//   }

//   if (ev.event !== 'exec_success' && ev.event !== 'exec_exception') {
//     // console.log(JSON.stringify(ev))
//   }

//   if (ev.event === 'handle_added') {
//     await processTag(ev.data.handle)
//   }
// })

// wsp.onClose.addListener((event) => {
//   if (event.code === 4001) {
//     console.log('Connection closed, new client has connected.')
//   } else {
//     console.log('Connection closed: ' + event.code)
//   }
// })

// wsp.open()

class BulkScanner {
  ReaderConnected = false

  // Stores scanned halo data
  Halos = {}

  // Cache elements
  Els = {
    metadata: document.querySelector('#metadata'),
    clear: document.querySelector('#clear'),
    export: document.querySelector('#export'),
    count: document.querySelector('#count'),
    settings: document.querySelector('#settings'),
    empty: document.querySelector('.empty-text'),
    records: document.querySelector('.records'),
    settingsDropdown: document.querySelector('.settings-dropdown'),
  }

  // Setup
  constructor() {
    // Retrieve
    this.LoadHalosFromStorage()

    // Update page
    this.Render()

    // Add event listeners
    this.AddSettingsListeners()
    this.AddClearListeners()

    // Setup websockets
    this.SetupWebsockets()
  }

  // Storage
  LoadHalosFromStorage = () => {
    try {
      // Get off local storage
      const halos = localStorage.getItem('halos')

      // Set on state
      if (halos) this.Halos = JSON.parse(halos)
    } catch (err) {
      console.log(err)
    }
  }

  UpdateLocalStorage = () => {
    localStorage.setItem('halos', JSON.stringify(this.Halos))
  }

  // Websockets
  SetupWebsockets = () => {
    // Setup listener
    this.wsp = new WebSocketAsPromised('ws://localhost:49437', {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({ uid: requestId }, data),
      extractRequestId: (data) => data && data.uid,
    })

    this.wsp.open()

    // Handle close
    this.wsp.onClose.addListener((event) => this.HandleWebSocketsClose(event))

    // Handle events
    this.wsp.onUnpackedMessage.addListener(async (ev) => {
      switch (ev.event) {
        case 'reader_added':
          this.ReaderConnected = true
          break
        case 'handle_added':
          this.HandleScannedHalo(ev)
          break
        case 'exec_success':
          this.HandleScanSuccess(ev)
          break
        case 'exec_exception':
          this.HandleScanFailure(ev)
          break
        default:
          console.log('default', ev)
      }
    })
  }

  HandleWebSocketsClose = (event) => {
    if (event.code === 4001) {
      console.log('Connection closed, new client has connected.')
    } else {
      console.log('Connection closed: ' + event.code)
    }
  }

  HandleScannedHalo = async (ev) => {
    /*
      Get keys
    */

    const res1 = await this.wsp.sendRequest({
      type: 'exec_halo',
      handle: ev.data.handle,
      command: {
        name: 'get_pkeys',
      },
    })

    if (!res1.data?.res?.publicKeys) return

    // Create halo object
    const keys = parseKeysCli(res1.data.res.publicKeys)
    keys['address'] = ethers.utils.computeAddress('0x' + keys['primaryPublicKeyRaw'])

    // Return early if it already exists
    if (this.Halos[keys['primaryPublicKeyHash']] != undefined) return

    // Add metadata
    const metadata = this.Els.metadata.value
    if (metadata.length > 0) keys.metadata = metadata

    /*
      Get sign data
    */

    const res2 = await this.wsp.sendRequest({
      type: 'exec_halo',
      handle: ev.data.handle,
      command: {
        name: 'sign',
        message: this.Els.metadata.value,
        keyNo: 1,
      },
    })

    keys.sig = res2.data.res

    /* 
      Update everything
    */

    // Add to state
    this.Halos[keys['primaryPublicKeyHash']] = keys

    // Update local storage
    this.UpdateLocalStorage()

    // Update page
    this.Render()

    console.log('123', this.Halos)
  }

  AddSignData = () => {}

  HandleScanSuccess = async (event) => {}

  HandleScanFailure = (ev) => {
    console.log('This scan failed', ev)
  }

  VerifyChip = async () => {
    let keys = publicKeys ? parseKeysCli(publicKeys) : parseKeys(buf2hex(staticHaloData))

    let primaryPublicKeyHash = keys['primaryPublicKeyHash']
    keys['metadata'] = this.Els.metadata.value
    keys['address'] = ethers.utils.computeAddress('0x' + keys['primaryPublicKeyRaw'])

    const recordExists = this.Halos[primaryPublicKeyHash] !== undefined

    if (!recordExists) {
      // Add to data object
      this.Halos[primaryPublicKeyHash] = keys

      // Create row html
      const row = buildRow(keys['primaryPublicKeyHash'])

      // Append it
      document.querySelector('.records').appendChild(row)

      // Sign
      const metadata = this.Els.metadata.value

      if (metadata.length > 0) {
        const res = await this.wsp.sendRequest({
          type: 'exec_halo',
          handle: ev.data.handle,
          command: {
            name: 'sign',
            message: metadata,
            keyNo: 1,
          },
        })

        this.Halos[primaryPublicKeyHash].sig = res
        console.log(this.Halos)
      }

      // Store it
      this.UpdateLocalStorage()
    }
  }

  // Visuals
  Render = () => {
    const haloCount = Object.entries(this.Halos).length

    // If we have some
    if (haloCount > 0) {
      // Append a record row for each one
      for (let primaryKeyHash in this.Halos) {
        // Get data
        const record = this.Halos[primaryKeyHash]

        // Build html with it
        const recordHTML = this.BuildRecordHTML(record)

        // Append to dom
        this.Els.records.appendChild(recordHTML)

        // Add listeners to it
        this.AddRecordListeners(recordHTML)
      }

      // Update buttons, counter, and empty text
      this.UpdateButtonsCounterAndEmpty()
    }
  }

  AddSettingsListeners = () => {
    this.Els.settings.addEventListener('click', () => {
      this.Els.settingsDropdown.classList.toggle('settings-dropdown-active')
    })

    this.Els.settingsDropdown.addEventListener('click', (e) => e.stopPropagation())

    document.querySelector('html, body').addEventListener('click', () => {
      this.Els.settingsDropdown.classList.remove('settings-dropdown-active')
    })
  }

  AddClearListeners = () => {
    this.Els.clear.addEventListener('click', () => {
      if (confirm('Clear all scanned chips?')) {
        this.Halos = {}
        this.UpdateLocalStorage()
        this.UpdateButtonsCounterAndEmpty()
      }
    })
  }

  AddRecordListeners = (recordEl) => {
    const deleteButton = recordEl.querySelector('.record-header-delete')
    const toggleArea = recordEl.querySelector('.record-header')

    deleteButton.addEventListener('click', (e) => {
      // so toggle not triggered
      e.stopPropagation()

      // Get record key
      const pk = recordEl.getAttribute('data-primary')

      // Remove record from dom
      recordEl?.remove()

      // Remove from stored halos
      delete this.Halos[pk]

      // Update buttons n stuff
      this.UpdateButtonsCounterAndEmpty()

      // Update local storage
      this.UpdateLocalStorage()
    })

    toggleArea.addEventListener('click', (e) => {
      recordEl.classList.toggle('record--active')
    })
  }

  UpdateButtonsCounterAndEmpty = () => {
    const haloCount = Object.entries(this.Halos).length

    // Toggle element visiblity
    if (haloCount > 0) {
      this.Els.clear.classList.remove('hide')
      this.Els.export.classList.remove('hide')
      this.Els.count.classList.remove('hide')
      this.Els.empty.classList.add('hide')
    } else {
      this.Els.clear.classList.add('hide')
      this.Els.export.classList.add('hide')
      this.Els.count.classList.add('hide')
      this.Els.empty.classList.remove('hide')
    }

    // Update count
    this.Els.count.textContent = haloCount
  }

  BuildRecordHTML = (record) => {
    const el = document.createElement('div')
    el.classList.add('record')
    el.setAttribute('data-primary', record.primaryPublicKeyHash)

    const pkSplit = splitHash(record.primaryPublicKeyHash)

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
}

new BulkScanner()
