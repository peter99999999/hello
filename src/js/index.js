
require('../css/index.less');
require('../css/main.scss');




require('../css/output_wrapper.css');
//var $=JQUERY;
var $ = require("jquery");
var showdown = require("./showdown.js");
var Clipboard = require("./clipboard.js");
var CodeTheme = require("./theme/code-theme");
var CssTheme = require("./theme/css-theme");
var Cookie=require("./common/cookie.js");
var StyleCom=require("./common/sytle_com.js");
var ExportHtml= require("./export_html.js");

var ColorApp= require("./color/colorApp.js");
var ScrollSync= require("./ui/scrollsync.js");
var WindowHandle= require("./ui/WindowHandle.js");
var PopUp= require("./ui/popup.js");
var FileExplorer=null;
if(ELECTRON_APP)
{
    FileExplorer= require("./ui/FileExplorer.js");
}
var LocalStore=require("./common/localstore.js");
window.showdown=showdown;
require("./showdown-plugins/katex/katex-latex.js");
//require("./showdown-plugins/showdown-prettify-for-wechat.js");
require("./showdown-plugins/showdown-github-task-list.js");
require("./showdown-plugins/showdown-footnote.js");
//require("./showdown-plugins/showdown-ghost-footnotes.js");
require("./showdown-plugins/showdown-toc.js");
var figure =require("./showdown-plugins/showdown-figure.js");
var UploadImg=require("./uploadImg.js");
//require('./highlight/highlight.js');
//require("./google-code-prettify/run_prettify.js"); //Gary delete it,as it will go to download the  https://cdn.rawgit.com/google/code-prettify/master/loader/prettify.css ,but will fail usually


var DEMO_FILE='readme_v2_7_0.md';
var OUTPUT_WRAPPER_CSS_FILE='output_wrapper_v2_6_0.css'
var gCodeThemeIns;
var gCssThemeIns;
var gHtml=false;
var gFileExplolerIns;
window.CSS_WRAPPER=".output_wrapper";

window.current_code_size_style='';
window.code_size_default_style='';
window.code_size_tight_style='';
window.codeThemeCss='';
window.outputWrapperStyleSheets='';


//for the stylesheet
window.OUTPUT_WRAPPER_ID="output_wrapper_style";
window.CODE_THEME_ID='code_theme';
window.CODE_SIZE_ID='code_size';
window.MY_CSS_ID="mycss";
window.VERSION_WARN_ID="versionwarn";

//var PageTheme = require("./theme/page-theme");
var hljs = require("./highlight/highlight.pack.js");

//var hljsLine = require("./highlight/highlightjs-line-numbers.js");
var gJuice = require('juice');
var firstEdit=true;
var timerId=null;
var copy_trigger=false;
gJuice.nonVisualElements=["BR"];

var SAVE_TEXT_COOKIE_NAME='SAVE_TEXT_COOKIE_NAME'



//window.output_wrapper_css_ext1=' .output_wrapper pre code{font-family: Consolas, Inconsolata, Courier, monospace; display: block !important; word-wrap: normal !important; word-break: normal !important; white-space: pre !important; overflow: auto !important;} ';
//window.output_wrapper_css_ext2=' .output_wrapper pre code *{word-wrap: inherit !important; word-break: inherit !important;  white-space: inherit !important;} ';
//解决代码在一些手机上的缩进无效的情况，如OPPO r11
window.output_wrapper_css_ext1=' .output_wrapper pre code{font-family: Consolas, Inconsolata, Courier, monospace; display: block !important; white-space: pre !important; word-wrap: normal !important; word-break: normal !important;  overflow: auto !important;} ';
window.output_wrapper_css_ext2=' .output_wrapper pre code *{word-wrap: inherit !important; word-break: inherit !important;} ';

window.output_wrapper_css_katex_ext=' .katex .msupsub .vlist > span {display: inline-block;height: 0;position: static;vertical-align:super; }';
//window.output_wrapper_css_katex_ext=' .katex .msupsub .vlist > span {display: inline-block;height: 0;position: static;vertical-align:middle; }; .katex .msupsub .vlist span .mathrm{display: inline-block;height: 0;position: static;vertical-align:super; }; .katex .msupsub .vlist span .mathit{display: inline-block;height: 0;position: static;vertical-align:sub; } ';
//window.output_wrapper_css_katex_ext='';
window.updateData=function(data)
{
    updateOutput(); 
}
window.saveEditData=function()
{
    return(gFileExplolerIns.fs_saveFile( $('#editor').val()));
}

window.updateEditData=function(data)
{
    firstEdit=false;
    $('#editor').val(data); 
    updateOutput(); 
}

function DelKateInvalidInfo()
{
    $('#render_output_id .katex-mathml').each(function() {
          $(this).html('');

       });
}


function GetInlineCssHtmlOutput()
{
    // var testJuice=gJuice.inlineContent("<p>abc</p>","p{font-size:20px}");
  
    DelKateInvalidInfo();
     var val=$('#render_output_id').html(); 
     var allStyleSheets=window.output_wrapper_css_ext1+window.output_wrapper_css_ext2+window.outputWrapperStyleSheets+window.output_wrapper_css_katex_ext+window.codeThemeCss+window.current_code_size_style+window.mycss;
    
     var result = gJuice.inlineContent(val,allStyleSheets,{preserveImportant:true,inlinePseudoElements:true}); //this will make the copy html  to weixin display correct,otherwise the ul li color not effect
     
     /*$('#render_output_id').html(result); 
     $("#output_wrapper_id *").each(function(i,block) {
         var color=$(block).css("color");
         var fontsize=$(block).css("font-size");
         var lineheight=$(block).css("line-height");
         $(block).css("color",color);
         $(block).css("font-size",fontsize);
         $(block).css("line-height",lineheight);

    });

     result= $("#output_wrapper_id").html();
     $('#render_output_id').html(val); */
     return result;
}
//OnlineMarkdown.init();
function CodeThemeCall(para_a)
{ 

   updateOutput();

}
function CssThemeCall()
{
    window.code_size_default_style=StyleCom.FindCssText(window.CSS_WRAPPER+' .code_size_default',window.MY_CSS_ID);
    window.code_size_default_style=window.CSS_WRAPPER+' pre code {'+window.code_size_default_style+'}';
    window.code_size_tight_style=StyleCom.FindCssText(window.CSS_WRAPPER+' .code_size_tight',window.MY_CSS_ID);
    window.code_size_tight_style=window.CSS_WRAPPER+' pre code {'+window.code_size_tight_style+'}';
    gCodeThemeIns.UpdateCodeSize();
    updateOutput();
}



function start()
      {
         
              let editTimerId=null;
              const UPDATE_EDIT_TIMER=200;
              window.converter =  new showdown.Converter({
              extensions: ['tasklist','footnote','katex-latex',figure,'showdown-toc'],
              tables: true,
              simpleLineBreaks:true,
              literalMidWordUnderscores:true,//要打开此选项，否则，有些数学公式如：$H(D_2) = -(\frac{2}{4}\ log_2 \frac{2}{4} + \frac{2}{4}\ log_2 \frac{2}{4}) = 1$，会显示不出来
              strikethrough:true,
              backslashEscapesHTMLTags:true,//can user \ to escape the html tag,for example :\<div>
             // emoji:true,
             //omitExtraWLInCodeBlocks:true,
              prefixHeaderId:"h"
            });
             
           

         
           // var katex_style=StyleCom.GetStyleSheetWithID("katex_style");
            StyleSheetInit();
           
            $.ajax({url:DEMO_FILE,success:function(data){

             

              $('#editor').val(data);
               updateOutput();
          }});
             PopUp.init();
            new UploadImg();
            new ColorApp();
            gCodeThemeIns=new CodeTheme();
            gCssThemeIns=new CssTheme();
            gCodeThemeIns.SetCallBack(CodeThemeCall);
            gCssThemeIns.SetCallBack(CssThemeCall);
            gCodeThemeIns.init();
            gCssThemeIns.init();
            new ExportHtml();
            new ScrollSync();
            new WindowHandle();
            if(ELECTRON_APP)
            {
                gFileExplolerIns=new FileExplorer();
            }
            else
            {
                $("#filewindow_popup").hide();
            }
          //  new PageTheme();   
            var clipboard=new Clipboard('.btn');
            /*var clipboard=new Clipboard('.btn',{
                text: function(trigger) {
                    var copy_html= $('#render_output_id').html();
                    return copy_html;
                }
            });*/
         

           /* var win = document.getElementById('editor_render').contentWindow;
        win.document.body.contentEditable="true";
       // win.document.body.innerHTML="<div class='output_wrapper'>"+val+'</div>';
        var iframeNode=win.document.body;
        $(iframeNode).on('input keydown paste', updateOutput);*/
             
           // $('#editor').on('input keydown paste', updateOutput);  
           $('#editor').on('paste', updateOutput);  
           $('#editor').on('input keydown', function(){
                if(editTimerId!=null)
                {
                    clearTimeout(editTimerId);
                }        
                editTimerId=setTimeout(function(){
                    editTimerId=null;
                    updateOutput();
                },UPDATE_EDIT_TIMER);
           });
           
           // window.onresize =DisplayWindowSize;
           // DisplayWindowSize();
            updateOutput();
           // drag_displaywindow_handle();

            $('#html').click(function () {
               if ($(this).prop("checked")) {
                   gHtml=true;
           
               } else {
                 gHtml=false;
               } 
               updateOutput(); 
       
            });

           $('#edit_file').click(function(){

               if(firstEdit)
               {
                let saveText="";
                if(!ELECTRON_APP)
                 {
                     saveText=LocalStore.getValue(SAVE_TEXT_COOKIE_NAME);
                 }
                 //for test
     
                /*  var url = 'http://127.0.0.1/getblogData';
                         var postStr=" ";
                         $.ajax({url:url,
                           //contentType: "application/x-www-form-urlencoded;charset=utf-8", //only for form
                           contentType:'application/json;charset=utf-8',//can post your define data
                           type:"POST",
                           data:postStr,           
                           //data:submitObj,
                           success:function(data){   
                                //console.log(data+'\n'); 
                                 $('#editor').val(data); 
                                 updateOutput(); 
                           }

                         });   */


                 $('#editor').val(saveText); 
                 updateOutput(); 
                 firstEdit=false;
              }
              else
              {
                //Cookie.setCookie(SAVE_TEXT_COOKIE_NAME,$('#editor').val(),365);
              }
              
              gCssThemeIns.closeWindow();
           });

           $('#copy_btn').on("click",function()
           {
              copy_trigger=true;
           });

            $('#render_output_id').on("copy", function(e)
          {
             if(copy_trigger)
             {
                 var result=GetInlineCssHtmlOutput();
                 copy_trigger=false;               
                var clipboardData = e.originalEvent.clipboardData||e.clipboardData||window.clipboardData;
                var html=result;
                var text=result;
                html=html.substr("<div".length,html.length-"<div".length);
                html=html.substr(0,html.length-"</div>".length);
                html="<section "+html+"</section>";

                html=html.replace(/<a href="#/g, '<a href="');//as the weixin don't support the start with:href="#,and handle it specially
                clipboardData.setData("text/html", html);
                clipboardData.setData("text/plain", text);
                //window.showSuccessMessage("\u5df2\u6210\u529f\u590d\u5236\u5230\u526a\u5207\u677f");
                return e.preventDefault();
              }
          }); 


        
          /*  var ifrm=document.getElementById("editor_render");
           ifrm.contentWindow.document.body.contentEditable= "true"; */


         /* clipboard.on('success', function(e) {
              console.info('Action:', e.action);
              console.info('Text:', e.text);
              console.info('Trigger:', e.trigger);

           //   e.clearSelection();
          });*/

        
          //var result = juice.inlineContent("<style>div{color:red;}</style><div/>","*{margin:0;padding:0;}");
         
        

         /* var styleSheets  = document.styleSheets;
          for(var i=0;i<styleSheets.length;i++){
          var ocssRules=document.styleSheets[i].cssRules || document.styleSheets[i].rules || window.CSSRule.STYLE_RULE;  
          var styleString = $.map(ocssRules, function(rule) {
              return 'cssText' in rule ? rule.cssText : '';
           }).join("\n");
          //window.prompt("Copy to clipboard: Ctrl+C, Enter", styleString);
          console.log('styleString:',styleString); 
          gStyleSheetsStr=gStyleSheetsStr+styleString;
 };
*/
        

        
         




      }






function updateOutput() {    
    const AUTO_SAVE_TIME=2000;
        var editorVal=$('#editor').val();  
       
       /* var inputAscii;         
        for(var i=0;i<editorVal.length;i++)          
        {         
            inputAscii=editorVal.charCodeAt(i);         
        }   */
        
        var val = window.converter.makeHtml(editorVal);
        //var val = window.converter.makeHtml(editorVal+'<br/>');//in the md file only include the code block,add a <br/> to it to make the copy  have not problem
        //var val = window.converter.makeHtml('<section>'+editorVal+'</section><br/>');//in the md file only include the code block,add a <br/> to it to make the copy  have not problem
        //var val = converter.makeHtml(editorVal);//in the md file only include the code block,add a <br/> to it to make the copy  have not problem
         /*for(var i=0;i<val.length;i++)          
        {         
            inputAscii=val.charCodeAt(i);         
        }   */

       
        //$('#editor_render').val("<div class='output_wrapper' >"+val+'</div>');
        /*var win = document.getElementById('editor_render').contentWindow;
        win.document.body.contentEditable="true";
       // win.document.body.innerHTML="<div class='output_wrapper'>"+val+'</div>';
        var iframeNode=win.document.body;
        $(iframeNode).html("<div class='output_wrapper' id='output_wrapper_id'>"+val+'</div>');
        var iframe_div=win.document.getElementById('output_wrapper_id');
        $(iframe_div).find('li').each(function() {
            $(this).html('<span><span>' + $(this).html() + '</span></span>');
        });
        $(iframe_div).find("li").each(function() {
            $(this).css('color',"#FF0000");
        });*/
        /*  var ifrm=document.getElementById("editor_render");
        //ifrm.contentWindow.document.body.innerHTML=val;
        ifrm.contentWindow.document.body.innerText=val;*/

        //$('#render_output_id').html(val);
        //$('#render_output_id').html("<div class='output_wrapper' id='output_wrapper_id'>"+val+'</div>');//for not weixin
        $('#render_output_id').html("<div class='output_wrapper' id='output_wrapper_id'>"+val+'</div>');//for  weixin
        //$('#render_output_id').html(val);
        //$('#render_output_id').html("<section><section class='output_wrapper' id='output_wrapper_id' data-role='outer'>"+val+'</section></section>');
        //$('#render_output_id').html("<section class='output_wrapper' id='output_wrapper_id' data-role='outer'>"+'<section>'+val+'</section></section>');
       
       
       $('#render_output_id li ').each(function() {
           var childrendCount=$(this).children().length;
           if(childrendCount==0)
           {
               var html= $(this).html();
               html='<span>' + html + '</span>';
               $(this).html(html);
           }

       });
    
       $(":header").each(function() { //h1~h6
              $(this).html('<span>' + $(this).html() + '</span>');
        });


        /*$('#render_output_id blockquote').each(function() {
            var htmlVal=$(this).html();
            htmlVal=htmlVal.replace(/^  /,'');
           // htmlVal=htmlVal.replace(/^\n/,'');
            $(this).html(htmlVal);
        });
*/
        
        
       /* $('li ').each(function() {
            $(this).css('color',"#FF0000");
        });*/

       
       /* $("ol,ul,p").each(function() { //h1~h6
              $(this).html('<section>' + $(this).html() + '</section>');
        });*/
       
       $('#render_output_id pre code').each(function(i, block) {
                
                var codeHtml;
               //* if(gHtml)
                {
                      codeHtml=$(block).html();
                      codeHtml=codeHtml.replace(/ /g, "&nbsp;");
                      $(block).html(codeHtml);
                }//*/
                 
                hljs.highlightBlock(block);         
                codeHtml=$(block).html();//如果不把换行转成<br/>会出现指定语言时第一句的换行有问题。
                codeHtml=codeHtml.replace(/\r\n/g, '<br/>');
                codeHtml=codeHtml.replace(/\n/g, '<br/>');
                codeHtml=codeHtml.replace(/\r/g, '<br/>');
                if ($('#codeline').prop("checked"))
                {//get the line num
                 
                  {
                   
                     var lines= codeHtml.split(/<br\/>|<br>/g);
                     codeHtml='';
                     var lineNumHtml='';
                     var lineNo=0;
                     var linesLen=lines.length;
                     var linelenStrMax='';
                     var lineNoStr='';
                     if(linesLen>0)
                     {
                        if(lines[linesLen-1]=='')
                        {
                           linesLen=linesLen-1;
                        }
                     }
                     linelenStrMax=linelenStrMax+linesLen;
                     for (var i = 0;i<linesLen;  i++)
                     {
                        lineNo++;
                        lineNo=lineNoStr=''+lineNo;
                        for(var j=lineNo.length;j<linelenStrMax.length;j++)
                        {
                            lineNoStr=' '+lineNoStr;//补空格，使右对齐
                        }
                        codeHtml=codeHtml+'<span class="linenum hljs-number">'+lineNoStr+'</span>'+lines[i]+'<br/>';
                     }
                   
                  }
                
               }//get the line num
                 


              $(block).html(codeHtml);
                //
                
            });

        $('#render_output_id pre code').each(function(i, block) {
          //  var codeHtml2;
         //  hljs.lineNumbersBlock(block);
          // $(block).html(codeHtml2);
            //window.hljs.lineNumbersBlock(block);
          });

       // val=$('#render_output_id').html(); 
        
        

        {  
            var result;
            
            if(gHtml)
            {            
               result = GetInlineCssHtmlOutput();
               $('#render_output_id').text(result);
            }  
            else
            {
              //$('#render_output_id').html(result);
            }
        }
        

        if(!firstEdit)
        {
           if(timerId!=null)
           {
                clearTimeout(timerId);
           }
          $('#saveIndicate').css("visibility","hidden");
           timerId=setTimeout(function(){
                    timerId=null;
                    let editData=$('#editor').val();
                    $('#saveIndicate').css("visibility","visible");
                    if(ELECTRON_APP)
                    {
                        if(window.saveEditData())
                        {
                           
                                $('#saveIndicate').html("已保存到：");
                           
                        }
                        else
                        {
                            $('#saveIndicate').html("<span class='warning'>不能保存到：</span> ");
                        }
                    }
                    else
                    {
                        LocalStore.setValue(SAVE_TEXT_COOKIE_NAME, editData);  
                    }

                        //for test
                        /*  localStorage.setItem(SAVE_TEXT_COOKIE_NAME, "");  
                         var url = 'http://127.0.0.1/updateblogData';
                         var postStr=$('#editor').val();
                         $.ajax({url:url,
                           //contentType: "application/x-www-form-urlencoded;charset=utf-8", //only for form
                           contentType:'application/json;charset=utf-8',//can post your define data
                           type:"POST",
                           data:postStr,           
                           //data:submitObj,
                           success:function(data){   
                                console.log(data+'\n'); 
                           }

                         });   */
                    
              },AUTO_SAVE_TIME);
        }
       
      
     
}

function MyConvert(){
         

      document.addEventListener("DOMContentLoaded", function (event)    
       {       
        start(); 
     });

      /* setTimeout(function(){
                 start();  
              },5000);*/
};

function GetStyleSheet(index)
{
   var styleString='';
   if(index<document.styleSheets.length)
   {
     var ocssRules=document.styleSheets[index].cssRules || document.styleSheets[index].rules || window.CSSRule.STYLE_RULE; 
     var id=document.styleSheets[index].id;
      styleString = $.map(ocssRules, function(rule) {
                  var cssText= 'cssText' in rule ? rule.cssText : '';
                  if(cssText.indexOf('.code_size_default')>=0)
                  {
                    window.code_size_default_style='pre code {'+rule.style.cssText+'}';  
                  }
                  else if(cssText.indexOf('.code_size_tight')>=0)
                  {
                    window.code_size_tight_style='pre code {'+rule.style.cssText+'}';;
                  }
                  return cssText;
               }).join("\n");
      //console.log('styleString:',styleString); 
   }
   return styleString;

}
function StyleSheetInit()
{
        StyleCom.append(window.OUTPUT_WRAPPER_ID);
        var url = './css/'+OUTPUT_WRAPPER_CSS_FILE;
         $.ajax({url:url,
           success:function(data){   
       
                 $('#output_wrapper_style').text(data);

               // var styleString=StyleCom.AppendPrefixToAllRules(window.CSS_WRAPPER,window.OUTPUT_WRAPPER_ID);
                var styleString=StyleCom.GetStyleSheetWithID(window.OUTPUT_WRAPPER_ID);
                window.outputWrapperStyleSheets=styleString;
              // $('#output_wrapper_style').text(window.window.outputWrapperStyleSheets);
               $('#output_wrapper_style').text(window.outputWrapperStyleSheets+window.output_wrapper_css_ext1+window.output_wrapper_css_ext2);
                
           }

         });  
}
//$(document).ready(MyConvert());
MyConvert();
/*window.onload = function() 
{
   MyConvert();
 }*/
//$().ready(MyConvert);
