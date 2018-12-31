rem electron-packager . md2all --win --out ../ElectronApp --arch=x64 --version=0.0.1
set APP_PATH_SRC=electronApp_src
set APP_PATH_TARGET=electronApp_target
rmdir /s /q %APP_PATH_SRC% 
mkdir %APP_PATH_SRC% 
rmdir /s /q %APP_PATH_TARGET% 
mkdir %APP_PATH_TARGET% 

xcopy /s /e  static %APP_PATH_SRC%\static\
copy  package.json %APP_PATH_SRC%
copy  main.js %APP_PATH_SRC%
electron-packager ./%APP_PATH_SRC% md2all --win --out ./%APP_PATH_TARGET% --arch=x64 --version=0.0.1