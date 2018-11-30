var fs=null;
var PATH =null;
if(ELECTRON_APP)
{
    fs = require("fs");
    PATH= require('path');
}
const LOCAL_STORE_PATH="./localstore/"
var LocalStore=function()
{

}

LocalStore.getValue=function(name)
{
    let realName=name;
    let value=null;
    if(ELECTRON_APP)
    {
        realName=LOCAL_STORE_PATH+realName;
        if(fs.existsSync(realName))
        {
            value=fs.readFileSync(realName).toString();
        }
    }
    else
    {
        if (window.localStorage)
        {
            value=localStorage.getItem(realName);
        }
    }   
    return value;
}
LocalStore.setValue=function(name,value)
{
    let realName=name;
    if(ELECTRON_APP)
    {
        if(!fs.existsSync(LOCAL_STORE_PATH))
        {
            fs.mkdirSync(LOCAL_STORE_PATH);
        }
        realName=LOCAL_STORE_PATH+realName;
        fs.writeFileSync(realName, value);
    
    }
    else
    {
        if (window.localStorage)
        {
            localStorage.setItem(name, value);  
        }
    }
}
module.exports = LocalStore;