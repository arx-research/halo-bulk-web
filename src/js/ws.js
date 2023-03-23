const WebSocketAsPromised = require('websocket-as-promised')

// Create webhook
const wsp = new WebSocketAsPromised('ws://localhost:49437', {
  packMessage: (data) => JSON.stringify(data),
  unpackMessage: (data) => JSON.parse(data),
  attachRequestId: (data, requestId) => Object.assign({ uid: requestId }, data),
  extractRequestId: (data) => data && data.uid,
})

export default wsp
