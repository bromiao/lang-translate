const _translate = require('@iamtraction/google-translate');

let option = {
  from: 'zh-cn',
  to: 'en'
}

function setLang(opt) {
  // 适配原有接口
  let config = {
    'zh': 'zh-cn', // 简体中文
    'en': 'en', // 英语
    'vie': 'vi', // 越南语
    'th': 'th' // 泰语
  }
  opt.from = config[opt.from]
  opt.to = config[opt.to]
  option = Object.assign({}, option, opt)
}

// 统一接口 使返回一样的数据结构
function syntheticData(original, converted) {
  let keys = original
  let vals = converted
  let newArr = keys.map((src, i) => {
      dst = vals.find((v, _i) => _i === i)
      // console.log(src, dst, i)
      return {src, dst}
  })
  return newArr;
}

function translate(str, flag, fn) {
  _translate(str, option).then(res => {
    if (res.text) {
      // console.log('------str--------', JSON.stringify(str))
      // console.log('------text--------', JSON.stringify(res.text))
      let originalArr =str.split('\n')
      let convertedArr = res.text.split('\n')
      // console.log('------originalArr--------', JSON.stringify(originalArr))
      // console.log('------convertedArr--------', JSON.stringify(convertedArr))
      let data = syntheticData(originalArr, convertedArr)
      fn && fn(flag, data);
    }
  }).catch(err => {
    console.error(err);
  });
}

module.exports = {
  translate,
  setLang
}

// let arr = [
//   "万岁",
//   "你好世界",
//   "可以吗",
//   "厉害",
//   "牛牛",
//   "哈哈",
//   "看看",
//   "试试",
//   "返水设置",
//   "会员限制"
// ]
// let str = JSON.stringify(arr)
// translate(str, (res) => {
//   console.log(res)
// })
