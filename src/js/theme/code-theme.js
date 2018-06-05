var $ = require("jquery");
var Cookie=require("../common/cookie.js");
var StyleCom=require("../common/sytle_com.js");



var gCodeThemeCallBackFunc=null;
var themes = [
 'favorite',
 'agate',
 'androidstudio',
 'arduino-light',
 'arta',
 'ascetic',
 'atelier-cave-dark',
 'atelier-cave-light',
 'atelier-dune-dark',
 'atelier-dune-light',
 'atelier-estuary-dark',
 'atelier-estuary-light',
 'atelier-forest-dark',
 'atelier-forest-light',
 'atelier-heath-dark',
 'atelier-heath-light',
 'atelier-lakeside-dark',
 'atelier-lakeside-light',
 'atelier-plateau-dark',
 'atelier-plateau-light',
 'atelier-savanna-dark',
 'atelier-savanna-light',
 'atelier-seaside-dark',
 'atelier-seaside-light',
 'atelier-sulphurpool-dark',
 'atelier-sulphurpool-light',
 'atom-one-dark',
 'atom-one-light',
 'brown-paper',
 'codepen-embed',
 'color-brewer',
 'darcula',
 'dark',
 'darkula',
 'default',
 'docco',
 'dracula',
 'far',
 'foundation',
 'github',
 'github-gist',
 'googlecode',
 'grayscale',
 'gruvbox-dark',
 'gruvbox-light',
 'hopscotch',
 'hybrid',
 'idea',
 'ir-black',
 'kimbie.dark',
 'kimbie.light',
 'magula',
 'mono-blue',
 'monokai',
 'monokai-sublime',
 'obsidian',
 'ocean',
'paraiso-dark',
'paraiso-light',
'pojoaque',
'purebasic',
'qtcreator_dark',
'qtcreator_light',
'railscasts',
'rainbow',
'routeros',
'school-book',
'solarized-dark',
'solarized-light',
'sunburst',
'tomorrow',
'tomorrow-night',
'tomorrow-night-blue',
'tomorrow-night-bright',
'tomorrow-night-eighties',
'vs',
'vs2015',
'xcode',
'xt256',
'zenburn',
];



var CODE_THEME_STR='codeTheme';
var CODE_SIZE_STR='codeSize2';
var CODE_LINE_STR='codeline';

var currentTheme;
var currentCodeSize=0;
var currentCodeLineNum=false;





//let CodeTheme = function () {
  var CodeTheme = function () {
  //this.init();
};





function UpdateCodeTheme(theme)
{
    var url = './highlight/'+theme+ '.css';
    /*$("#codeThemeId").attr('href', './themes/' + val + '.css');*/
     //console.log('styleSheet.cssText:',$("#codeThemeId").style.cssText);
    //$("#codeThemeId").attr('href', './highlight/' + val + '.css');
     $.ajax({url:url,success:function(data){           
              $('#code_theme').text(data);
              window.codeThemeCss=StyleCom.AppendPrefixToAllRules(window.CSS_WRAPPER,window.CODE_THEME_ID)
               $('#code_theme').text(window.codeThemeCss);
              gCodeThemeCallBackFunc(0);
          }});

}

CodeTheme.prototype.UpdateCodeSize=function()
{
      if(currentCodeSize==1)
      {  
           window.current_code_size_style=window.code_size_tight_style;         
      }
      else
      {
            window.current_code_size_style=window.code_size_default_style;
      }
      $('#code_size').text(window.current_code_size_style);
      if(gCodeThemeCallBackFunc!=null)
      {
         gCodeThemeCallBackFunc(1);
      }
}


 

CodeTheme.prototype.init = function() {
 
    StyleCom.append(window.CODE_THEME_ID);
    StyleCom.append(window.CODE_SIZE_ID);
   currentTheme=Cookie.getCookie(CODE_THEME_STR);
  if (currentTheme==null || currentTheme=="")
  {
    currentTheme= 'favorite';//androidstudio';//'atelier-dune-dark';//'atelier-forest-light';
  }
 // UpdateCodeTheme(currentTheme);
 currentCodeLineNum=Cookie.getCookie(CODE_LINE_STR);
 if (currentCodeLineNum==null || currentCodeLineNum=="")
  {
    currentCodeLineNum=false;
  }
  if(currentCodeLineNum==1)
  {
      currentCodeLineNum=true;
      $('#codeline').prop("checked", true); 
  }


  currentCodeSize=Cookie.getCookie(CODE_SIZE_STR);
  if (currentCodeSize==null || currentCodeSize=="")
  {
    currentCodeSize=0;
  }
  if(currentCodeSize==1)
  {
      $('#narrowcode').prop("checked", true); 
  }
  this.UpdateCodeSize();
  
  this.bindEvt();
};

CodeTheme.prototype.bindEvt = function() {

  var self=this;
  var $options = $.map(themes, function(item) {
    var selected = currentTheme === item ? ' selected' : '';
    return '<option value="' + item + '"' + selected + '>' + item +'</option>';
  });
  $('.code-theme').html($options);
  $('.code-theme').on('change', function() {
    var val=$(this).val();
    UpdateCodeTheme(val);
    //if(typeof(value)=="undefined")
    Cookie.setCookie(CODE_THEME_STR,val,365);
   

  }).trigger('change');

  

 
  $('#narrowcode').click(function () {
      
        //var cssText=$(".code_size_narrow").attr('class');
         
         

         if ($(this).prop("checked")) {
             //$("#codesizeId").attr('href', './pageThemes/code_narrow.css');
              currentCodeSize=1;
              Cookie.setCookie(CODE_SIZE_STR,1,365);
      //        window.tagNarrow=true;
         } else {
             //$("#codesizeId").attr('href', './pageThemes/code_default.css');
             currentCodeSize=0;
             Cookie.setCookie(CODE_SIZE_STR,0,365);
     //        window.tagNarrow=false;
         }
         self.UpdateCodeSize();
       
         
         
         var word_space=  $("#editor_render pre code").css("word-spacing");
         var letter_space= $("#editor_render pre code").css("letter-spacing");
       
     });
  

     $('#codeline').click(function () {
       if ($(this).prop("checked")) {          
                  Cookie.setCookie(CODE_LINE_STR,1,365);
                  currentCodeLineNum=true;
         
             } else {
                
                 Cookie.setCookie(CODE_LINE_STR,0,365);
                 currentCodeLineNum=false;
         
             }
              gCodeThemeCallBackFunc(2);

      });


   

     
};

 
CodeTheme.prototype.SetCallBack= function(callback) {
//0:update codetheme
//1:update codesize
//2:update codeline
    gCodeThemeCallBackFunc=callback;
}


module.exports = CodeTheme;



