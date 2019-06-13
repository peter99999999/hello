var $ = require("jquery");
var Cookie=require("../common/cookie.js");
let popShowFlag=false;
const VERSION_UPDATE=`
<strong>版本号：V2.8.4</strong><br/>
更新日期：2019-06-13<br/>
1:解决在iphone手机上代码不能滚屏的问题<br/>
`
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
    if (versionWarn==null || versionWarn==""||(versionWarn!=window.CUR_VER))
    {
      Cookie.setCookie(window.VERSION_WARN_ID,window.CUR_VER,365);
      let strhtml=$("#version_popup").html();
      PopUp.showContent(strhtml);
      $('.versionContentId').html(VERSION_UPDATE);
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