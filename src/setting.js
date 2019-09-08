var sizeInput = document.querySelector('#size-input')
var switchInput = document.querySelector('#enable-transferable')

var size = 0 // MB
var USE_TRANSFERRABLE = false

function setByteSize() {
  size = (1024 * 1024) * toNumber(sizeInput.value)
}
function setEnableSwitch() {
  USE_TRANSFERRABLE = switchInput.checked
}

setByteSize()
setEnableSwitch()

sizeInput.addEventListener('change', function() {
  setByteSize()
})
switchInput.addEventListener('change', function() {
  setEnableSwitch()
})

var arrayBuffer = null
var uInt8View = null
var originalLength = null

function setupArray() {
  arrayBuffer = new ArrayBuffer(size)
  uInt8View = new Uint8Array(arrayBuffer)
  originalLength = uInt8View.length

  for (var i = 0; i < originalLength; ++i) {
    uInt8View[i] = i
  }
}
