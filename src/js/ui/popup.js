var $ = require("jquery");
var Cookie=require("../common/cookie.js");
let popShowFlag=false;
var PopUp = function () {
    
   
   
  };
  
  PopUp.init = function() {
    PopUp.hide();
    let versionWarn=Cookie.getCookie(window.VERSION_WARN_ID);
    if (versionWarn==null || versionWarn=="")
    {
      Cookie.setCookie(window.VERSION_WARN_ID,"havedone",365);
      let strhtml=$("#version_popup").html();
      PopUp.showContent(strhtml);
      $('.versionContentId').html("<strong>此版本支持云图床功能</strong><br/>选取本地图片后，会自动上传到你的七牛云图床，并在Md2All中自动插入相应markdown,显示图片。<br/><a href='https://www.cnblogs.com/garyyan/p/9181809.html'>详细教程,请点击此链接查看</a>");
    }
   

    $("#global_popup").on("click",".close_popup_id",function(){
        PopUp.hide();
    })
  }
  PopUp.hide= function()
  {
    popShowFlag=false;
    $("#global_popup .popup_conetent").html("");
    $("#global_popup").hide();
  }
  PopUp.showContent = function(content)
  {
    popShowFlag=true;
    $("#global_popup .popup_conetent").html(content);
    $("#global_popup").show();
  }
  PopUp.isShow= function()
  {
    return popShowFlag;
  }

  module.exports = PopUp;