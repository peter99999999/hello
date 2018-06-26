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
    if (versionWarn==null || versionWarn==""||(versionWarn!=window.CUR_VER))
    {
      Cookie.setCookie(window.VERSION_WARN_ID,window.CUR_VER,365);
      let strhtml=$("#version_popup").html();
      PopUp.showContent(strhtml);
      $('.versionContentId').html("<strong>本版本更新如下</strong><br/>1:增加对 <strong>行内</strong> Latex数学公式的支持<br/>2:优化Latex数学公式的显示;<br/>3:解决有些公式复制到公众号时可能出现的显示不完整的问题;<br/>4:在“一键排版”的各样式文件中增加对Latex的样式，你可能需要<strong>“恢复预设值”</strong>才能看到新的样式;<br/>5:对“综合示例”和“标题淡雅”这两个样式进行了一些调整.<br/><br/><br/><strong>支持云图床功能</strong><br/>选取本地图片后，会自动上传到你的七牛云图床，并在Md2All中自动插入相应markdown,显示图片。<br/><a href='https://www.cnblogs.com/garyyan/p/9181809.html'>详细教程,请点击此链接查看</a>");
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