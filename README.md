### 使用说明


把要翻译的中文语言包替换 lang/zh.js
通过 `npm run t [语种]` 指定翻译的语言类型
翻译成功后会生成 dist/[语种].js

### 命令

```javascript
# 安装依赖
npm install

# 基于中文翻译 
# npm run t [en | vie | th | cht | all] （备注： all 会翻译列出的所有的语言）比如：

npm run t en

# 监控词典变化自动增量翻译
npm run watch

# 运行定制化处理
npm run play

```

### 高级用法
如果不喜欢通过覆盖zh.js的方式进行翻译，可以选择在package.json里配置相关字段如下：

```json
# 指定翻译引擎 [baidu | google]
 "engine": "google",

# 指定zh.js所在的相对路径
 "inputFile": "../[项目目录]/src/i18n/zh.js",

 # 指定翻译后输出的文件目录
  "outputDir": "../[项目目录]/src/i18n/test",
```

### custom.js 

提供一些定制化处理方案 目前支持对JSON对象的直接翻译

```javascript
const cn = {
  message: {
    '现场百家乐': '现场百家乐',
    activity: {
        tag: {
          all: '全部',
          vip: 'VIP',
        }
    },
    immediateRegistration: '立即注册'
  }
}

tJSON(cn,{from: 'zh', to: 'en'}, (data) => {
  console.log(JSON.stringify(data))
})

```

### play.js

定制化处理方案的调用入口

### translate.js

用来注册与管理翻译引擎

### utils.js

提供一些处理脏数据的方法



参考：

 http://api.fanyi.baidu.com/doc/21

 https://github.com/iamtraction/google-translate
