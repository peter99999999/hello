// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//var fs = require("fs");
const electron = require("electron");
const {dialog} = require('electron').remote;
var remote = require('electron').remote;
var fs = remote.require('fs');
const shell = require('electron').shell;
const os = require('os');
var filePath="F:/study/electron/vscode-electron-debug-master/electron-quick-start-debug/input3.txt";
console.log('render,hello world!');

document.body.addEventListener('click', () => {
    //shell.showItemInFolder(os.homedir());
   

//const dialog = electron.dialog;
//console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}));


    dialog.showOpenDialog({
        //defaultPath :os.homedir(),
        properties: [
         //   'openFile',
            'openDirectory', 
            'multiSelections'
        ],
        filters: [
          //  { name: 'zby', extensions: ['json'] },
        ]
    },function(res){
        //callback(res[0]) //我这个是打开单个文件的
        console.log("res is:"+res);
    })


    console.log('hello vscode,in render!')
  console.log("test fs.writeFile start");
            
   fs.writeFile(filePath, 'input2,I use fs.writeFile to write the data',  function(err) {
    console.log("fs test aa");
   if (err) {
       return console.error(err);
   }
   console.log("fs test a");
   console.log("write success!");
    console.log("fs test b");
   console.log("read data!");
   fs.readFile(filePath, function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("the read data is:" + data.toString());
       console.log("fs test c");
   });
});

console.log("test fs.writeFile end");

})