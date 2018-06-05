var fs = null;
var PATH = null;
if(ELECTRON_APP)
{
    fs = require("fs");
    PATH = require('path');
}
const CONFIG_FILE="./prjconfig.json";
import { isNullOrUndefined } from "util";

var Config = function () {
   
};

Config.getInfo=function(){
    let self=this;
    let configObj;
    if(fs.existsSync(CONFIG_FILE))
	{
				    let str=fs.readFileSync(CONFIG_FILE)
					configObj = JSON.parse(str);
					if(isNullOrUndefined(configObj.filePaths))
					{
						configObj.filePaths=[];
                    }
                    if(isNullOrUndefined(configObj.cookies))
					{
						configObj.cookies=[];
					}
    }
    else
    {
        configObj={"filePaths":[],"cookies":[]};
    }
    return configObj;

}

Config.saveInfo=function(configObj){
    let self=this;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configObj));
}

Config.getCookie=function(name)
{
    let cookieValue=null;
    let configObj=this.getInfo();
    for(let i=0;i<configObj.cookies.length;i++)
    {
      if(name==configObj.cookies[i].name)
      {
        cookieValue=configObj.cookies[i].value;
        break;
      }
    }
    return cookieValue;
}
Config.setCookie=function(name,value)
{
    let cookieValue=null;
    let configObj=this.getInfo();
    let i;
    for(i=0;i<configObj.cookies.length;i++)
    {
      if(name==configObj.cookies[i].name)
      {
        configObj.cookies[i].value=value;
        break;
      }
    }
    if(i==configObj.cookies.length)
    {
        let newObj=new Object({"name":name,"value":value});
        configObj.cookies.push(newObj);
    }
    this.saveInfo(configObj);
}
module.exports = Config;