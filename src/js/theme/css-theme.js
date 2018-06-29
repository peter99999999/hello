var $ = require("jquery");
var Cookie=require("../common/cookie.js");
var StyleCom=require("../common/sytle_com.js");
var LocalStore=require("../common/localstore.js");
//require("../jquery.caret-1.5.2.js");

//require("jquery-caret");
var ENABLE_EDIT_INDEX=0;//2
var css_hljs = require("../highlight/highlight.pack.js");
var gCssThemeCallBackFunc=null;





window.mycss="";
var css_themes = [
 ['favorite','最爱样式'],
 ['default','默认样式'],
['title_color','标题颜色'],
['title_center','标题居中'],
['title_bg','标题背景'],
['title_cool','标题酷酷'],
['thought','感想,诗词'],
['quote','引用块样式'],
['code','代码块样式'],
['title_danya','标题淡雅'],
['title_before','标题前修饰'],
['title_bg_linecolor','标题背景渐变'],
['largerspace','字距偏大'],
['title_border_under','标题下边框'],
['title_border_y','标题上下边框'],
['title_border_all','标题四边框'],
['title_first_letter','标题首字突出'],
['title_after','标题后修饰'],
['title_reverse','标题倒挂'],
['background_grid','网格背景'],
['combine','综合示例'],

];
/*var css_themes_file = [
 'default',
'titlecolor',
'titlecenter',
'gobal',
'code',
'favorite',
];*/


var CSS_THEME_STR='css_Theme2';
var CSS_SAVE_STR='css_save_cok';
var DEFAULT_CSS_THEME=11;
var cssCurrentTheme=DEFAULT_CSS_THEME;








var timerId=null




var CssTheme = function () {
 // this.init();
};





function css_updateOutput()
{
          if(timerId!=null)
           {
                clearTimeout(timerId);
           }
         
           timerId=setTimeout(function(){
               $('#cssEditArea pre code').each(function(i, block) {
                    css_hljs.highlightBlock(block);
                    });
              },1000);
   /*        
           if(timerId!=null)
           {
                clearTimeout(timerId);
           }
         
           timerId=setTimeout(function(){

              var  text=$('#cssEditArea').text();
              var MDtext="```css"+"\n"+text+"\n"+"```";
              var html = window.converter.makeHtml(MDtext+'<br/>');
             // $('#cssEditArea').caret('position');
             // saveSelection();
              $('#cssEditArea').html(html);
              $('#cssEditArea pre code').each(function(i, block) {
              css_hljs.highlightBlock(block);
              });
              text=$('#cssEditArea').text();
              html=$('#cssEditArea').html();
             
              var i;
              i=0;
                   
              },1000);*/

      
}
function ApplyCssToStyle(cssData)
{
          
   $('#mycss').text($('#cssEditArea').text());  
   var styleString=StyleCom.AppendPrefixToAllRules(window.CSS_WRAPPER,window.MY_CSS_ID);
   
   window.mycss=styleString;
   $('#mycss').text(window.mycss);
   if(gCssThemeCallBackFunc!=null)
   {
     gCssThemeCallBackFunc();
   }

}     
                                              



function loadServerCss(theme,applyToStyle)
{
         var url = './cssThemes/'+css_themes[theme][0]+ '.css?'+window.CUR_VER;
         $.ajax({url:url,success:function(data){           
                 
                 //$('#cssEditArea').text(data);
                 $('#cssEditArea').html(data);
                  if(applyToStyle)
                  {
                    ApplyCssToStyle(data);
                  }
                 //$('#cssEditArea').html('<pre><code>'+data+'</pre></code>');
                 //css_updateOutput();
               //   gCodeThemeCallBackFunc(0);
              }});
}
function CssUpdateTheme(theme)
{
     var haveLoadCss=false;
     if(theme>=ENABLE_EDIT_INDEX)
     {
         var cookieName=CSS_SAVE_STR+theme;
         var css_data="";
       
          css_data=LocalStore.getValue(cookieName);
       
         //var css_data=Cookie.getCookie(cookieName);
        if(css_data!=null&&css_data!="")
        {
             $('#cssEditArea').html(css_data);
              ApplyCssToStyle(css_data);
              haveLoadCss=true;
        }
     }
     if(!haveLoadCss)
     {
          loadServerCss(theme,true);
      }

}
function CheckEditable()
{
   /*      if(cssCurrentTheme>=ENABLE_EDIT_INDEX)
          {
                $('#cssEditArea').attr("contentEditable", true);
                $('#css_save').addClass("icon_class");
                $('#css_reset').addClass("icon_class");
          }
          else
          {
                $('#cssEditArea').attr("contentEditable", false);
                $('#css_save').removeClass("icon_class");
                $('#css_reset').removeClass("icon_class");
          }*/
}

CssTheme.prototype.init = function() {
 
  
   

    StyleCom.append(window.MY_CSS_ID);
    var temp_cssCurrentTheme='';
   /* if (window.localStorage)
    {
          temp_cssCurrentTheme=localStorage.getItem(CSS_THEME_STR);
    }*/
    temp_cssCurrentTheme=Cookie.getCookie(CSS_THEME_STR);
    if(temp_cssCurrentTheme==null || temp_cssCurrentTheme=="")
    {
       cssCurrentTheme=DEFAULT_CSS_THEME;
    }
    else
    {
        var theme=parseInt(temp_cssCurrentTheme)
        if(isNaN(temp_cssCurrentTheme))
        {
          cssCurrentTheme=DEFAULT_CSS_THEME;
        }
        else if (theme<0||theme>=css_themes.length)
        {
            cssCurrentTheme= DEFAULT_CSS_THEME;//androidstudio';//'atelier-dune-dark';//'atelier-forest-light';
        }
        else
        {
          cssCurrentTheme=theme;
        }
    }
        
 
    $('#mycss_icon').click(function(){
              var a;
              a=10;
              if($('#cssSetting').css("visibility")=='hidden')
              {
                 $('#cssSetting').css("visibility","visible");
               
                 CheckEditable();              
                 CssUpdateTheme(cssCurrentTheme);                 
                 
              }
              else
              {
                 $('#cssSetting').css("visibility","hidden");
              }
      });
    this.bindEvt();
 
  
    
};

CssTheme.prototype.bindEvt = function() {

 /* var $options = $.map(css_themes, function(item) {
  var selected = cssCurrentTheme === item ? ' selected' : '';
    return '<option value="' + item + '"' + selected + '>' + item +'</option>';
  });*/
 
  var $options=new Array();
  for(var i=0;i<css_themes.length;i++)
  {
     var selected='';
     if(i==cssCurrentTheme)
     {
         selected=' selected';
     }
    
     $options[i] ='<option value="' + css_themes[i][1] + '"' + selected + '>' + css_themes[i][1] +'</option>';
  }
  $('.css-theme').html($options);
  $('.css-theme').on('change', function() {
    cssCurrentTheme = $(this).get(0).selectedIndex;
    CheckEditable();
    CssUpdateTheme(cssCurrentTheme);
    Cookie.setCookie(CSS_THEME_STR,cssCurrentTheme,365);
  /* if (window.localStorage)
    {
          localStorage.setItem(CSS_THEME_STR,cssCurrentTheme);
    }*/

  }).trigger('change');

   

  $("#css_close").click(function(){
       $('#cssSetting').css("visibility","hidden");
   });
   $("#css_save").click(function(){     
        if(cssCurrentTheme>=ENABLE_EDIT_INDEX)
        {
            var cookieName=CSS_SAVE_STR+cssCurrentTheme;
            //Cookie.setCookie(cookieName,$('#cssEditArea').html(),365);
            
            LocalStore.setValue(cookieName,$('#cssEditArea').html());
           
            ApplyCssToStyle($('#cssEditArea').text());
        }

    });
    $("#css_reset").click(function(){
       if(cssCurrentTheme>=ENABLE_EDIT_INDEX)
        {
            loadServerCss(cssCurrentTheme,false);
        }
   });




  // $('#cssEditArea').on('input keydup paste', css_updateOutput);  
  

   
 

   

     
};


CssTheme.prototype.closeWindow= function() {

    if($('#cssSetting').css("visibility")=='visible')
     {
        $('#cssSetting').css("visibility","hidden");
      }
}

CssTheme.prototype.SetCallBack= function(callback) {

    gCssThemeCallBackFunc=callback;
}

module.exports = CssTheme;



