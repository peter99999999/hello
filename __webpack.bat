rem webpack --target electron-renderer
webpack --progress --colors --watch
rem webpack ./entry.js bundle.js --module-bind "css=style!css"
rem webpack --progress --colors
rem webpack-dev-server --progress --colors