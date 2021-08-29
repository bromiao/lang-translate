const { tJSON } = require('./custom.js')
const zh = require('../lang/zh.js')
// console.log(zh)

tJSON(zh, {from: 'zh', to: 'en'} ,(data) => {
  console.log(JSON.stringify(data))
})
