importScripts('shared.js')

var ready = false
var useTransferable = false

self.onmessage = function(e) {
  if (!ready) {
    initComplete(e.data)
    return
  }

  // Presumably, this worker would create its own Uint8Array or alter the
  // ArrayBuffer (e.data) in some way. For this example, just send back the data
  // we were sent.
  var uInt8View = new Uint8Array(e.data)

  if (useTransferable) {
    self.postMessage(uInt8View.buffer, [uInt8View.buffer])
  } else {
    self.postMessage(e.data)
  }
}

self.onerror = function(message) {
  log('worker error')
}

function log(msg) {
  var object = {
    type: 'debug',
    msg: source() + msg
  }
  self.postMessage(object)
}

function initComplete(data) {
  ready = true
  useTransferable = data instanceof ArrayBuffer
  log('Ready')
}

// setupArray()
