const baidu = require('./translate/translate-b.js')
const google = require('./translate/translate-g.js')
const { engine } = require('../package.json')

const engineConfig = {
  baidu,
  google
}

module.exports = engineConfig[engine]