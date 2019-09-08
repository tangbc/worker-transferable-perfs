var worker = null
var startTime = 0
var supported = false

var runTimes = 0
var resultElement = document.querySelector('#result')
var resultPrintElement = document.querySelector('#result-print')
function log(str) {
  var style = 'color: ' + (runTimes ? (USE_TRANSFERRABLE ? 'blue' : 'orange') : 'green') + ';'
  resultPrintElement.innerHTML += '<span style="'+ style +'">'.concat('['+ runTimes +'] ', str, '</span>\n')
}

function updateScroll() {
  resultElement.scrollTop = resultPrintElement.offsetHeight + 100
}

var delayTime = 50
function insertBreak() {
  setTimeout(function() {
    resultPrintElement.appendChild(document.createElement('br'))
    updateScroll()
  }, delayTime)
}


function initWorker() {
  worker = new Worker('./src/worker.js')

  worker.onmessage = function(e) {
    var data = e.data

    if (data.type && data.type == 'debug') {
      log(data.msg)
    } else {
      // Sometimes very fast result is 0.
      var elapsed = Math.max(0.001, seconds(startTime))
      var rate = Math.round(data.byteLength / elapsed)

      log(source() + 'postMessage took: ' + (elapsed * 1000) + ' ms')
      log(source() + 'postMessage rate: ' + toFileSize(rate) + '/s')
    }
  }

  // To feature detect: send a small ArrayBuffer. If transferable objects are
  // supported, the ArrayBuffer will be neutered (cleared out) after sent.
  try {
    var ab = new ArrayBuffer(1)
    worker.postMessage(ab, [ab])
    if (ab.byteLength) {
      supported = false
      worker.postMessage(1)
    } else {
      supported = true
    }
  } catch (e) {
    supported = false
    worker.postMessage(1)
  }

  if (!supported) {
    alert('Transferable Objects are not supported in this browser!')
    return
  }

  log(source() + 'Ready')

  insertBreak()
}

function runTest() {
  runTimes++

  // Need to do this on every run for the repeated runs with transferable arrays. They're cleared out after they're transferred.
  setupArray()

  startTime = new Date()

  if (USE_TRANSFERRABLE && supported) {
    // Note: clears the uInt8View and it's underlying ArrayBuffer, transfering it
    // out of this view, to the worker.
    // Passing multiple transferables:
    //   worker.postMessage({view1: int8View, buffer2: anotherBuffer}, [int8View.buffer, anotherBuffer])
    //   window.postMessage(arrayBuffer, targetOrigin, [arrayBuffer])
    worker.postMessage(uInt8View.buffer, [uInt8View.buffer])
  } else {
    worker.postMessage(uInt8View.buffer)
  }

  insertBreak()
}

var runButton = document.querySelector('#run')
runButton.addEventListener('click', function() {
  runTest()
})

var clearButton = document.querySelector('#clear')
clearButton.addEventListener('click', function() {
  resultPrintElement.innerHTML = ''
  runTimes = 0
})

window.addEventListener('load', function() {
  initWorker()
}, false)
