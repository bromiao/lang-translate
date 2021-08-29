// 解决中文字典里 中英文key 不统一的问题
// 统一处理成中文key
function conversion (obj) {
  let re = /[\u4e00-\u9fa5]/gm
  for (const key in obj) {
    var val = obj[key]
    if (!re.test(key) && re.test(val)) {
      obj[val] = key
      delete obj[key]
    }
    if (Object.prototype.toString.call(val) === '[object Object]') {
      conversion(val)
    }
  }
  console.log(obj)
}

// 处理 json对象 入参翻译，返回的数据对象 中文key 也被翻译的问题
// 直接解析出中文key 的json 对象 （支持 对象深度）
function merge (_src, _des) {

  let valArr = []

  function run (obj, fn) {
    for (const key in obj) {
      let val = obj[key]
      if (Object.prototype.toString.call(val) === '[object Object]') {
        run(val, fn)
      } else {
        fn && fn(obj, key)
      }
    }
  }

  run(_des, (obj, key) => {
    valArr.push(obj[key])
  })

  //console.log(valArr)

  run(_src, (obj, key) => {
    obj[key] = valArr.shift()
  })

  console.log(11111, JSON.stringify(_src))

  return _src
}

module.exports = {
  merge,
  conversion
}


