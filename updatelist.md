2018-12-31
prepare use the github page as the website,and use the :https://garyyan.github.io/gitpage/static/index_bak.html  can access it

2018-11-28
1:in "common\localstore.js" if find the LOCAL_STORE_PATH  folder don't exist,will mkdir for it
2:update the  "Make_ElectronApp.bat "to make it more smart 
3:open linke in new window:openLinksInNewWindow:true,
4:add *.html display.
5:add FileExplorer.prototype.GetCurrentFileName,when Electron App,the export default file name is current select file name

2018-11-16
测试为什么70之后的chrome版本在iphone上显示代码会换行错误，结果是： the "white-space: pre !important" attr can't pasted to iframe
add detail in readme.md

2018-06-05
1：在文件处理方面，已实现所有要加的功能，及错误的处理，如：文件名过长，同名等
除：当不是通过此app增删文件夹时，不会自动扫描文件夹的改动并自动刷新目录树
2：增加了app的cookie,localstorage的各平台的处理
3：在webpack下增加不同平台下的条件编译，及如jquery别名(alias)的处理
4：已实现七牛云的部分功能，token正在处理中

2018-04-17
已实现Electron的部分功能，如对应本地目录增加文件，增加文件夹，删除文件
但未实现删掉文件夹，
另外，重命名时虽有检测是否有同名，但未对fs返回的文件是否错误做检测（如文件名过长），因为fs是异步时才有返回值，而异步的返回检测比较烦，要之后想想怎样统一去做

因为接下来要做小程序，同时工作上的事情也比较多，所以特别做个备份。