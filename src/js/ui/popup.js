var $ = require("jquery");
var Cookie=require("../common/cookie.js");
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
      $('.versionContentId').html("<strong>此版本已支持七牛云图床</strong><br/>选取本地图片后，会自动上传到七牛云，并在Md2All中自动插入相应markdown,显示图片。<ul>支持:<li>直接把图片拖拉到编辑框;</li><li>直接复制粘贴截图到编辑框;</li><li>或通过左上角“图片”图标选取图片!</li></ul>");
    }
   

    $("#global_popup").on("click",".close_popup_id",function(){
        PopUp.hide();
    })
  }
  PopUp.hide= function()
  {
    $("#global_popup .popup_conetent").html("");
    $("#global_popup").hide();
  }
  PopUp.showContent = function(content)
  {
    $("#global_popup .popup_conetent").html(content);
    $("#global_popup").show();
  }

  module.exports = PopUp;