import WebSocketAsPromised from 'websocket-as-promised'
import { computeAddress, hashMessage, sha256 } from 'ethers'
import { splitHash, parseKeysCli, download } from './js/helpers'
import { execHaloCmdWeb, haloRecoverPublicKey, haloConvertSignature, haloFindBridge } from '@arx-research/libhalo'

type modes = 'Legacy' | 'Standard'

class BulkScanner {
  // State
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
    this.UpdateScanButton()

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

  CheckMobile = () => {
    let check = false
    ;(function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true
      // @ts-ignore
    })(navigator.userAgent || navigator.vendor || window.opera)
    return check
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
  SetupWebsockets = async () => {
    try {
      const bridgeUrl = await haloFindBridge()

      // Setup listener
      this.wsp = new WebSocketAsPromised(bridgeUrl, {
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
        alert(ev)

        switch (ev.event) {
          case 'reader_added':
            this.ReaderConnected = true
            this.UpdateScanButton()
            break
          case 'reader_removed':
            this.ReaderConnected = false
            this.UpdateScanButton()
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
    } catch (err) {
      alert(err)
      console.log(err)
    }
  }

  HandleWebSocketsClose = async (event) => {
    if (event.code === 4001) {
      console.log('Connection closed, new client has connected.')
    } else {
      console.log('Connection closed: ' + event.code)

      if (event.code === 4002) {
        window.location.href = 'http://127.0.0.1:32868/consent?website=https://bulk.vrfy.ch/'
      }
    }
  }

  HandleScanFailure = (ev) => {
    console.log('This scan failed', ev)
  }

  // Handle Scans
  HandleReaderScan = async (ev) => {
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
    // if (this.Halos[keys['primaryPublicKeyHash']] != undefined) {
    //   this.UpdateScanButton()
    //   return
    // }

    // Add metadata
    const metadata = this.Els.metadata.value
    if (metadata.length > 0) {
      keys.metadata = metadata

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

      if (res2?.data?.res?.signature) {
        keys.sig = res2?.data?.res?.signature
      }
    }

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

      let options = {
        statusCallback: (cause) => {
          if (cause === 'init') {
            alert('init status')
          } else if (cause === 'retry') {
            alert('retry status')
          } else if (cause === 'scanned') {
            alert('retry scanned')
          }
        },
      }

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
      alert(err)

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
      // Hide sign button
      this.Els.signButton.classList.add('hide')

      let buttonText = 'Scan'

      if (this.ReaderConnected) {
        buttonText = 'Hold chip to reader to scan'
      } else if (this.Els.metadata.value.length > 0) {
        buttonText += ' and sign'
      }
      this.Els.scanButton.querySelector('span')!.textContent = buttonText
    } else {
      this.Els.signButton.classList.remove('hide')
      this.Els.scanButton.querySelector('span')!.textContent = 'Scan'
    }

    if (this.ReaderConnected && this.Mode == 'Standard') {
      this.Els.scanButton.classList.add('no-click')
      this.Els.scanButton.disabled = false
    } else if (
      !this.ReaderConnected &&
      this.Mode == 'Standard' &&
      navigator.platform.indexOf('Win') === -1 &&
      !this.CheckMobile()
    ) {
      this.Els.scanButton.classList.add('no-click')
      this.Els.scanButton.disabled = true
    } else {
      this.Els.scanButton.classList.remove('no-click')
      this.Els.scanButton.disabled = false
    }

    this.Els.signButton.disabled = this.Els.metadata.value.length === 0
  }

  // Event Listeners
  AddSettingsListeners = () => {
    this.Els.settings.addEventListener('click', () => {
      this.Els.settingsDropdown.classList.toggle('settings-dropdown-active')
    })

    this.Els.settingsDropdown.addEventListener('click', (e) => e.stopPropagation())

    document.querySelector('html, body')!.addEventListener('click', () => {
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

try {
  new BulkScanner()
} catch (err) {
  console.log(err)
}
