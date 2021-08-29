const path = require('path')
const fs = require('fs')
const { inputFile, outputDir } = require('../package.json')
const dirName = 'dist'
const historyFile = "._history"
function getInputPath() {
  return inputFile ? path.resolve(inputFile) : path.resolve('./lang/zh.js')
}

function getOutputDir() {
  return outputDir ? path.resolve(outputDir) : path.resolve(`./${dirName}/`)
}

function output(obj, fileName, cb) {
  let dir = getOutputDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
  }
  let outFile = `${dir}/${fileName}.js`
  console.log('path: ',`${outFile}`)
  if (fs.existsSync(outFile)) {
    appendContent(obj, outFile, cb)
  } else {
    writeFile(obj, outFile, cb)
  }
}

function creatHistory() {
  let src = getInputPath()
  let dest = `${getOutputDir()}/${historyFile}`
  fs.copyFileSync(src, dest);
  console.warn(new Date(),'Update translation record');
}

function getOldKeys() {
  let arr = []
  let _path = getOutputDir()
  if (_path) {
    _path = `${_path}/${historyFile}`
    if (fs.existsSync(_path)) {
      let _zh = require(_path)
      arr = Array.isArray(_zh) ? _zh : Object.keys(_zh)
    }
  }
  return arr
}

function appendContent(obj, outFile, cb) {
  let enFile = require(outFile)
  writeFile({...obj, ...enFile}, outFile, cb)
}

function writeFile(obj, outFile, cb) {
  let contentStr = JSON.stringify(obj, null, 1)
  contentStr = `module.exports = ${contentStr}`
  // contentStr = `'use strict';\nexports.__esModule = true;\nexports.default = module.exports = ${contentStr}`
  fs.writeFileSync(`${outFile}`, contentStr)
  cb && cb()
}

function diff(newKeys) {
  const oldKeys = getOldKeys()
  if (!oldKeys.length) {
    return newKeys
  }
  return newKeys.filter(v => !oldKeys.includes(v))
}

module.exports  = {
  diff,
  output,
  getInputPath,
  getOutputDir,
  creatHistory
}
