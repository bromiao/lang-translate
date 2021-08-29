const fy = require('./translate.js')
const { getInputPath, output, diff, creatHistory } = require('./io.js')
const { codeList } = require('./config.js')

let lang = {}
let counter = 0

function getKeysStr() {
  let zh = require(getInputPath())
  // let keys = Array.isArray(zh) ? zh : Object.keys(zh)
  let keys = Array.isArray(zh) ? zh : Object.keys(flattern(zh))
  keys = diff(keys)

  console.warn(new Date(), `Newly added [ ${keys.length} ] translation`);
  return (keys.length > 0) ? keys : ''
}


function flattern(v, parentKeys = []) {
  // 递归终止条件：如果 v 不是对象，直接返回 { path: v }
  if (typeof v !== 'object') {
    const newKey = parentKeys.length > 1 ? parentKeys.join('@') + '&&&&' + v : parentKeys.join('@')
    return { [newKey]: v }
  }
  const subs = Object.entries(v)
    .map(([key, value]) => flattern(value, [...parentKeys, key]));

  return Object.assign({}, ...subs);
}

function arrToJson(arr, n, value){
  return {[arr[n]]: (n < arr.length - 1) ? arrToJson(arr, n+1, value) : value}
}

function MergeRecursive(obj1, obj2) {
  let arr = Object.keys(obj2);
  let index = -1;
  while (++index < arr.length) {
    let p = arr[index];
    try {
      if (obj2[p] && typeof obj2[p] === 'object') {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }

    } catch (e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

async function t(_code) {
  fy.setLang({
    from: 'zh',
    to: _code
  })
  return new Promise( (resolve, reject) => {
    let keysStr = getKeysStr()
    console.log('词典总条数为：', keysStr.length)
    if (!keysStr){
      reject()
    }
    try {
      let queryStr = ''
      let reqList = []
      const base = 10000
      for (let i = 0; i < keysStr.length; i++) {
        if (queryStr.length < base) {
          queryStr += keysStr[i] + '\n'
          if (+i === keysStr.length - 1) {
            reqList.push(queryStr)
            queryStr = ''
          }
          continue
        }
        reqList.push(queryStr)
        queryStr = ''
      }

      for (let i in reqList) {
        setTimeout(() => {
          fy.translate(reqList[i], {i,len: reqList.length},function(flag,res) {
            console.log(1111111111, flag)
            res.forEach(({src, dst}) => {
              if (!dst) return
              if (_code === 'en') {
                dst = dst.charAt(0).toUpperCase() + dst.slice(1)
              }
              if (src.includes('&&&&')) {
                // console.log(111111111111, src , '\n', dst)
                const keyArr = src.split('&&&&')[0].split('@')
                const reg = /\S+(_|(\s&)+)/g
                if (reg.test(dst)) {
                  dst = src.split('&&&&')[0] + '&&&&' + dst.replace(reg, '')
                }

                let value = dst.split('&&&&')[1].trimStart().trimEnd()
                value = value.charAt(0).toUpperCase() + value.slice(1)

                const obj = arrToJson(keyArr.slice(1), 0, value)
                if (!lang[keyArr[0]]) {
                  lang[keyArr[0]] = obj
                } else {
                  lang[keyArr[0]] = MergeRecursive(lang[keyArr[0]], obj)
                }
              } else {
                lang[src] = dst
              }
            })

            if (+i === reqList.length - 1) {
              resolve(_code)
            }
          })
        }, (+i + 1) * 100)
      }

    } catch (error) {
      reject(error)
    }
  }).then(() => {
    let l = Object.keys(lang)
    output(lang, _code, ()=>{
      lang = {}
    })
    return _code
  })
}

async function run() {
  // # 并发请求 会遭到百度拒绝
  // # 产生报错：54005 	 长query请求频繁  请降低长query的发送频率，3s后再试
  // let pAll = []
  // codeList.forEach(((code)=>{
  //   pAll.push(t(code))
  // }))
  // Promise.all(pAll).then(function() {
  //     process.exit(0);
  // })

  // # 错误异步遍历的写法
  // codeList.forEach(((code)=>{
  //    let c = await t(code)
  //    console.log(c)
  // }))

  // # 绕过百度提示长query的发送频率，3s后再试 ，用队列的方式解决 排队一个一个来请求
  const len = codeList.length
  try {
    for (let i = 0; i < len; i++) {
      let c = await t(codeList[i])
      console.warn(new Date(),`${c}.js translation done`)
      if(++counter === len) {
        console.warn(new Date(),'Completion of program')
        creatHistory()
        process.exit(0)
      }
    }
  } catch (error) {
    console.warn(new Date(),'No translation added')
    process.exit(0)
  }

}
run()
