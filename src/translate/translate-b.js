const https = require('https');
const queryString = require('querystring');
const md5 = require('md5');

const errorMap = {
  52003: '用户认证失败',
  54001: '签名错误',
  54004: '账户余额不足',
};

let option = {
  from: 'zh',
  to: 'en'
}
function setLang(opt) {
  option = Object.assign({}, option, opt)
}

function translate(q, fn) {
  const salt = Math.random();
  const appid = '20210629000875206';
  const appSecret = 'WxPbDm4oAt3yzely16oP';
  const sign = md5(appid + q + salt + appSecret);
  const from = option.from;  
  const to = option.to;
  
  //query 长度：为保证翻译质量，请将单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个）
  const query = queryString.stringify({
    q,
    appid,
    from,
    to,
    salt,
    sign,
  });

  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: `/api/trans/vip/translate`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const object = JSON.parse(string);
      if (object.error_code) {
        console.error(errorMap[object.error_code] || object.error_msg);
        console.log('编译错误');
        process.exit(2);
      } else {
        // object.trans_result.map((obj) => {
        //   console.log(11, obj.dst);
        // });
        fn && fn(object.trans_result);
        //process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.write(query);
  request.end();
}

module.exports = {
  translate,
  setLang
}



// const obj = {
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
// let lang = {}
// translate(JSON.stringify(obj.message), (res) => {

//   // conversion
//   // conversion
//   console.log(res[0].dst)
   
// })