var $ = require("jquery");
var Cookie=require("../common/cookie.js");
let popShowFlag=false;
 const COPY_POPUP=`  
<div class="copyPopupContent common_pop">
    <div class="closePopupContainerId">
        <span class="icon_class  close_popup_icon close_popup_id" ></span>
    </div>
    <div class="copyPopupContentId">           
    </div>
</div>
</div>`;

var PopUp = function () {
    
   
   
  };
  
  PopUp.init = function() {
    PopUp.hide();
    Cookie.delCookie(window.VERSION_WARN_ID_PRE);
    let versionWarn=Cookie.getCookie(window.VERSION_WARN_ID);
    if (versionWarn==null || versionWarn=="")
    {
      Cookie.setCookie(window.VERSION_WARN_ID,"havedone",365);
      let strhtml=$("#version_popup").html();
      PopUp.showContent(strhtml);
      $('.versionContentId').html("<strong>此版本解决一些Latex数学公式的显示问题，点‘复制’显示了选择内容后，再点一次‘复制’就能把公式正确复制到公众号等平台</strong><br/><br/><br/><strong>支持云图床功能</strong><br/>选取本地图片后，会自动上传到你的七牛云图床，并在Md2All中自动插入相应markdown,显示图片。<br/><a href='https://www.cnblogs.com/garyyan/p/9181809.html'>详细教程,请点击此链接查看</a>");
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
  PopUp.showCopyPopupContent= function(content)
  {
    popShowFlag=true;
    $("#global_popup .popup_conetent").html(COPY_POPUP);
    $('.copyPopupContentId').html(content);
    $("#global_popup").show();
  }

  module.exports = PopUp;