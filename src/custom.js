const fy = require('./translate.js')
const { merge } = require('./utils.js')

// 支持对 JSON 对象的翻译
function tJSON(obj, opt, fn) {
  let str = JSON.stringify(obj)
  fy.setLang(opt)
  fy.translate(str, (res) => {
    // console.log(123456, res[0].src)
    console.log(654321, res[0].dst)
    let newObj = merge(JSON.parse(res[0].src), JSON.parse(res[0].dst))
    fn && fn(newObj)
  })
}

module.exports = {
  tJSON
}
// test
// const cn = {
//   message: {
//     '现场百家乐': '现场百家乐',
//     '保险百家乐': '保险百家乐',
//     '龙宝百家乐': '龙宝百家乐',
//     activity: {
//         nav: {
//           all: '全部',
//           vip: 'VIP红利',
//           newbie: '新手红利',
//           topic: '专题红利',
//           regular: '常规红利',
//           timeLimited: '限时红利'
//         },
//         tag: {
//           all: '全部',
//           vip: 'VIP',
//           newbie: '新手',
//           topic: '专题',
//           regular: '常规',
//           timeLimited: '限时'
//         }
//     },
//     immediateRegistration: '立即注册',
//     totalMoney: '总余额',
//     accountBalance: '账户余额',
//     selfWashingCount: '可洗码金额',
//     historyTitle: '历史记录',
//   }
// }

// tJSON(cn,{from: 'zh', to: 'vie'},(data) => {
//   console.log(JSON.stringify(data))
// })
