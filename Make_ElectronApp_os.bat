set APP_PATH_SRC=electronApp_src
set APP_PATH_TARGET=electronApp_target
electron-packager ./%APP_PATH_SRC% md2all --platform=darwin --out ./%APP_PATH_TARGET% --arch=x64 --version=0.0.1