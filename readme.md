remind to 
1:update the :window.CUR_VER="v=2_8_3"  to correspond version ,in "src\js\index.js" every version
2:update: <script src="./output/index.js?v=2_8_3"></script> ,to correspond version in index.html
3:open the baidu tongji in index.html
4:if report qiniu-js error,use:cnpm install qinui-js --save  to update it


compile and run
1:compile the web html: __webpack.bat
which will refer the "webpack.config.js"

2:run server:node server.js

3:then in your browser input: http://127.0.0.1:8081

known issue:
for chrome after 70 version,the "white-space: pre !important" attr can't pasted to iframe