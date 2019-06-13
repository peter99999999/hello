var $ = require("jquery");
var Cookie=require("../common/cookie.js");
let popShowFlag=false;
const VERSION_UPDATE=`
<strong>版本号：V2.8.3</strong><br/>
更新日期：2018-07-09<br/>
1:增加对以下语言的highlight<br/>
dart,r,delphi,vb(vbnet),vbs(vbscript),vbscript-html<br/><br/>

<strong>版本号：V2.8.2</strong><br/>
更新日期：2018-06-28<br/>
1:结合云图床，解决了Latex公式复制到公众号时有可能报“图片粘贴失败的问题”;<br/>
2:结合云图床，解决了Latex公式复制到知乎的问题;<br/>
3:点“图片”图标时，在云图床设置上新增了：“文中需要转换为图片的内容,会自动上传到云图床”选项;<br/>
4:在“一键排版”的各样式文件中更新了Latex的样式，主要是显示的大小，你可能需要<strong>“恢复预设值”</strong>才能看到新的样式.<br/><br/>

<strong>支持云图床功能</strong><br/>
选取本地图片后，会自动上传到你的七牛云图床，并在Md2All中自动插入相应markdown,显示图片。<br/>
<a href='https://www.cnblogs.com/garyyan/p/9181809.html'>详细教程,请点击此链接查看</a>
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