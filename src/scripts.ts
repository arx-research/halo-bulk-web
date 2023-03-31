import WebSocketAsPromised from 'websocket-as-promised'
import { computeAddress, hashMessage, sha256 } from 'ethers'
import { splitHash, parseKeysCli, download } from './js/helpers'
import { execHaloCmdWeb, haloRecoverPublicKey, haloConvertSignature } from '@arx-research/libhalo'

type modes = 'Legacy' | 'Standard'

class BulkScanner {
  // State
  ScanListening = false
  Mode: modes = 'Standard'
  ReaderConnected = false
  Halos = {}

  // Web sockets
  wsp: WebSocketAsPromised

  //Elements
  Els = {
    metadata: <HTMLInputElement>document.querySelector('#metadata'),
    clear: document.querySelector('#clear')!,
    export: document.querySelector('#export')!,
    count: document.querySelector('#count')!,
    settings: document.querySelector('#settings')!,
    empty: document.querySelector('.empty-text')!,
    records: document.querySelector('.records')!,
    settingsDropdown: document.querySelector('.settings-dropdown')!,
    scanButton: <HTMLButtonElement>document.querySelector('#scan')!,
    signButton: <HTMLButtonElement>document.querySelector('#sign')!,
    modeRadios: <NodeListOf<HTMLInputElement>>document.querySelectorAll('.settings-dropdown-dropdown-option-radio')!,
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
    this.AddModeSelectListener()
    this.AddMetadataListener()
    this.AddScanClickListener()
    this.AddExportListener()
    this.AddSignListener()

    // Setup websockets
    this.SetupWebsockets()
  }

  // Helpers
  GenerateDigest = (message) => {
    let messageBytes = hashMessage(message)
    return messageBytes.slice(2)
  }

  GenerateKeys = (keys) => {}

  DevLog = (data) => {
    document.querySelector('#console')!.innerHTML += JSON.stringify(data)
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
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => JSON.parse(data),
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
          this.HandleReaderScan(ev)
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

  HandleScanFailure = (ev) => {
    console.log('This scan failed', ev)
  }

  // Handle Scans
  HandleReaderScan = async (ev) => {
    if (!this.ScanListening) return

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
    keys['address'] = computeAddress('0x' + keys['primaryPublicKeyRaw'])

    // Return early if it already exists
    if (this.Halos[keys['primaryPublicKeyHash']] != undefined) {
      this.ScanListening = false
      this.UpdateScanButton()
      return
    }

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

    keys.sig = res2.data.res.signature

    /* 
      Update everything
    */

    // Add to state
    this.Halos[keys['primaryPublicKeyHash']] = keys

    // Update local storage
    this.UpdateLocalStorage()

    // Update page
    this.Render()

    // Reset scan button
    this.ScanListening = false
    this.UpdateScanButton()
  }

  HandleLegacyScan = async () => {
    // @ts-ignore Get data
    const res = await execHaloCmdWeb({ name: 'get_pkeys' })

    // Create keys
    const keys = parseKeysCli(res.publicKeys)
    keys['address'] = computeAddress('0x' + keys['primaryPublicKeyRaw'])

    // Add if doesnt exist
    if (this.Halos[keys['primaryPublicKeyHash']] !== undefined) return
    this.Halos[keys['primaryPublicKeyHash']] = keys
    // document.querySelector('#console')!.innerHTML += JSON.stringify(this.Halos[keys['primaryPublicKeyHash']])

    // Update storage
    this.UpdateLocalStorage()

    // Rebuild page
    this.Render()
  }

  HandleLegacySign = async () => {
    // Create digest
    const metadata = this.Els.metadata.value
    const digest = this.GenerateDigest(metadata)

    // @ts-ignore Send it
    const res = await execHaloCmdWeb({
      name: 'sign',
      keyNo: 1,
      digest,
      legacySignCommand: true,
    })

    // Find the record
    const potentialKeys: string[] = haloRecoverPublicKey(res.input.digest, res.signature.der)
    const potentialKey1 = sha256('0x' + potentialKeys[0].slice(2))
    const potentialKey2 = sha256('0x' + potentialKeys[1].slice(2))

    if (this.Halos[potentialKey1]) {
      // @ts-ignore
      const sig = haloConvertSignature(res.input.digest, res.signature.der, potentialKeys[0])
      this.Halos[potentialKey1].sig = sig
      this.Halos[potentialKey1].metadata = metadata
    } else if (this.Halos[potentialKey2]) {
      //@ts-ignore
      const sig = haloConvertSignature(res.input.digest, res.signature.der, potentialKeys[1])
      this.Halos[potentialKey2].sig = sig
      this.Halos[potentialKey2].metadata = metadata
    } else {
      alert('Please scan chip before signing')
    }

    // Update storage
    this.UpdateLocalStorage()

    // Rerender
    this.Render()
  }

  HandleStandardScan = async () => {
    try {
      const metadata = this.Els.metadata.value

      // Create Digest
      const digest = this.GenerateDigest(metadata)

      // @ts-ignore Send it
      const res = await execHaloCmdWeb({
        name: 'sign',
        keyNo: 1,
        digest,
      })

      // Create keys
      const keys = parseKeysCli({ 1: res.publicKey })
      keys['address'] = computeAddress('0x' + keys['primaryPublicKeyRaw'])

      if (metadata.length > 0) {
        keys['metadata'] = metadata
        keys['sig'] = res.signature
      }

      // Add if doesnt exist
      if (this.Halos[keys['primaryPublicKeyHash']] !== undefined) return
      this.Halos[keys['primaryPublicKeyHash']] = keys

      // Rebuild page
      this.Render()
    } catch (err) {
      if (err.name == 'HaloLogicError') {
        alert('Please switch to legacy mode')
      }
    }
  }

  // Render page
  Render = () => {
    // Clear old stuff
    this.Els.records.innerHTML = ''

    // Get count
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

  BuildRecordHTML = (record) => {
    const el = document.createElement('div')
    el.classList.add('record')
    el.setAttribute('data-primary', record.primaryPublicKeyHash)

    const pkSplit = splitHash(record.primaryPublicKeyHash)
    let signatureStuff = ''

    if (record.sig) {
      signatureStuff = `
      <div class="record-body-section">
      <h2>Signature DER</h2>
      <div class="record-body-section-box">
        ${record.sig.der}
      </div>
    </div>
      `
    }

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
        ${signatureStuff}
      </div>
      `

    return el
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
    this.Els.count.textContent = haloCount.toString()
  }

  UpdateScanButton = () => {
    if (this.Mode === 'Standard') {
      this.Els.signButton.classList.add('hide')

      let buttonText = 'Listening...'

      if (!this.ScanListening) {
        buttonText = 'Scan'
        if (this.Els.metadata.value.length > 0) buttonText += ' and sign'
      }

      this.Els.scanButton.querySelector('span')!.textContent = buttonText
    } else {
      this.Els.signButton.classList.remove('hide')
      this.Els.scanButton.querySelector('span')!.textContent = 'Scan'
    }

    this.Els.signButton.disabled = this.Els.metadata.value.length === 0
  }

  // Event Listeners
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
        this.Els.records.innerHTML = ''
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

  AddModeSelectListener = () => {
    this.Els.modeRadios.forEach((radio) => {
      radio.addEventListener('change', (e: any) => {
        const mode: modes = e.target.value
        this.Mode = mode
        this.UpdateScanButton()
      })
    })
  }

  AddExportListener = () => {
    this.Els.export.addEventListener('click', () => {
      download(JSON.stringify(this.Halos), 'halo-export.json')
    })
  }

  AddMetadataListener = () => {
    this.Els.metadata.addEventListener('keyup', () => {
      this.UpdateScanButton()
    })
  }

  AddScanClickListener = () => {
    this.Els.scanButton.addEventListener('click', async () => {
      if (this.ReaderConnected && this.Mode === 'Standard') {
        this.ScanListening = !this.ScanListening
        this.UpdateScanButton()
      } else if (this.Mode === 'Legacy') {
        this.HandleLegacyScan()
      } else {
        this.HandleStandardScan()
      }
    })
  }

  AddSignListener = () => {
    this.Els.signButton.addEventListener('click', () => {
      this.HandleLegacySign()
    })
  }
}

new BulkScanner()
