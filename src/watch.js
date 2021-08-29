const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;
const { inputFile } = require('../package.json')
const dir = inputFile ? path.resolve(inputFile) : path.resolve(__dirname, "../lang")

fs.watch(dir, (event, filename) => {
  if (filename === "zh.js" && event === "change") {
    console.log(`${filename} file Changed`);
    const cmdStr = 'npm run t all';
    exec(cmdStr, (err, stdout, stderr) => {
        if (err){
            console.log(err);
            console.warn(new Date(),'[ npm run t all ] execution failed');
        } else {
            console.log(stdout);
            console.warn(new Date(),'[ npm run t all ] execution succeed');
        }
    });
  }
});
