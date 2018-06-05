
let Config ;
if(ELECTRON_APP)
{
  Config = require("../common/config.js");
}
var Cookie = function(){
 
};

Cookie.getCookie=function(c_name)
{

  let cookieValue="";
  if(ELECTRON_APP)
  {
    
    cookieValue=Config.getCookie(c_name)
  }
  else
  {
      var c_start;
      var c_end;
      if (document.cookie.length>0)
        {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
          { 
              c_start=c_start + c_name.length+1 
              c_end=document.cookie.indexOf(";",c_start)
              if (c_end==-1)
              {
                c_end=document.cookie.length
              }
              cookieValue= unescape(document.cookie.substring(c_start,c_end))
          } 
        }
      
  }
 // console.log("return cookieValue:"+cookieValue);
  return cookieValue;
}

Cookie.setCookie=function(c_name,value,expiredays)
{
  if(ELECTRON_APP)
  {
   
    Config.setCookie(c_name,value)
  }
  else
  {
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      var cookieStr=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
      var cookieLen=cookieStr.length;
      document.cookie=cookieStr;
  }
}

Cookie.delCookie=function(c_name)
{
  if(ELECTRON_APP)
  {
    
  }
  else
  {
      var value=this.getCookie(c_name);
      if(value!=null)
      {
          var exp = new Date();
          var time=exp.getTime();
          var date=exp.getDate();
          var str=exp.toGMTString();
          exp.setTime(exp.getTime() + 1);//让它一秒后自动过期
          str=exp.toGMTString();
          document.cookie = c_name + "="+ escape (value) + ";expires=" + exp.toGMTString();
      
      }
    }
}

module.exports = Cookie;