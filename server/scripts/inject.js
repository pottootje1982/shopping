var Module = require("module")
var originalRequire = Module.prototype.require

let resolveMap

function newRequire() {
  const id = arguments[0]
  if (resolveMap[id]) {
    return originalRequire.apply(this, resolveMap[id])
  } else {
    return originalRequire.apply(this, arguments)
  }
}

Module.prototype.require = newRequire

function defineMap(map) {
  resolveMap = map
}

module.exports = { defineMap, newRequire }
