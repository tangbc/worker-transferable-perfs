function source() {
  if (self.importScripts) {
    return '<b>Worker:</b> '
  } else {
    return '<b>Thread:</b> '
  }
}

function time() {
  var now = new Date()
  var time = /(\d+:\d+:\d+)/.exec(now)[0] + ':'
  for (var ms = String(now.getMilliseconds()), i = ms.length - 3; i < 0; ++i) {
    time += '0'
  }
  return time + ms
}

function seconds(since) {
  return (new Date() - since) / 1000
}

function toMB(bytes) {
  return Math.round(bytes / 1024 / 1024)
}

function toFileSize(bytes) {
  return filesize(bytes)
}

function toNumber(value) {
  return Number(typeof value === 'string' ? value.trim() : value)
}
