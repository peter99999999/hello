
var $ = require("jquery");
require("./Blob.js");
require('canvas-toBlob');
var html2canvas=require("html2canvas");
var FileSaver = require('file-saver');
var StyleCom=require("./common/sytle_com.js");
var ExportHtml = function()
{
 
  this.FILE_EXPORT_CSS_COOKIE_NAME="file_export_css";
  this.FILE_EXPORT_NAME_COOKIE_NAME="file_export_name";
  this.DEFAULT_FILE_NAME="md2all";
  this.HTML_FILE="export.html"
  this.DOBY_CONETENT='<div id="export_content">hello Md2All</div>';
  this.content=$('#export_iframe').contents();
  this.fileName="";
 // this.output_wrapper_css='.output_wrapper pre code{font-family: Consolas, Inconsolata, Courier, monospace; display: block !important; word-wrap: normal !important; word-break: normal !important; white-space: pre !important; overflow: auto !important;}';
  this.init();
};

ExportHtml.prototype.InitInfo=function()
{
	 this.UpdateCss();

	 this.fileName=localStorage.getItem(this.FILE_EXPORT_NAME_COOKIE_NAME);
     if((this.fileName==null)||(this.fileName==""))
     {
               this.fileName=this.DEFAULT_FILE_NAME;
     } 
    
     $('#file_export_fileName').val(this.fileName);

}
ExportHtml.prototype.UpdateCss=function()
{
     var haveLoadCss=false;
     var css_data="";
     css_data=localStorage.getItem(this.FILE_EXPORT_CSS_COOKIE_NAME);
     if(css_data!=null&&css_data!="")
     {
               $('#file_export_cssEditArea').html(css_data); 
              this.ApplyCssToStyle(css_data);
              haveLoadCss=true;
     }
     if(!haveLoadCss)
     {
          this.loadServerCss(true);
     }

}

ExportHtml.prototype.loadServerCss=function(applyToStyle)
{
	 var self=this;
	 $.ajax({url:"./css/file_export_setting.css",
	 		 success:function(data){			        	           		        
			         $('#file_export_cssEditArea').html(data); 
			         if(applyToStyle)
			         {
			         	self.ApplyCssToStyle(data);	            
			         }
			  }
			
		});
}
ExportHtml.prototype.ApplyCssToStyle=function(data)
{
	 
	 
	 this.UpdateDefineCss(data);
     $('#file_export_container').css("visibility","visible");
	     
	    //var allStyleSheets=this.output_wrapper_css+window.codeThemeCss+window.current_code_size_style+window.mycss;
       var allStyleSheets=" \n"+window.output_wrapper_css_ext1+" \n"+window.outputWrapperStyleSheets+" \n"+window.codeThemeCss+" \n"+window.current_code_size_style+" \n"+window.mycss+" \n";
       
          $(this.content).find('#markdown_preview_css').text(allStyleSheets);
		 $(this.content).find('#export_content').html($('#render_output_id').html());
	
}

ExportHtml.prototype.export=function()
{
	 
    /* var htmlData="<!DOCTYPE html>"+"\n"+"<html>"+"\n"+$(content).find('html').html()+"\n"+"</html>";
     var file = new  File([htmlData], "Md2All.html", {type: "text/plain;charset=utf-8"});
	 FileSaver.saveAs(file);*/

}

ExportHtml.prototype.UpdateDefineCss=function(cssData)
{
	  cssData= $('#file_export_cssEditArea').text(); 
    $('#temp_style').text(cssData);
    var cssData=StyleCom.GetStyleSheetWithID('temp_style');//use the 'temp_style' to delete some explain info
    $('#temp_style').text('');
    $(this.content).find('#export_setting_css').text(cssData);
}

ExportHtml.prototype.init=function()
{
        var firstClick=true;
        var self=this;
       /* var proxy = require('html2canvas-proxy');
		var express = require('express');

		var app = express();
		app.use('/', proxy());*/

        $('#export_file').click(function(){
        	   
	        	
				/*html2canvas( $('#render_output_id')[0],{"proxy": "/img","logging": true}).then(function(canvas) {
				   $("#file_container").html(canvas);
				    $("#file_container").find("canvas").css("width","1000px");
				    var canvas =$("#file_container").find("canvas")[0];
					//var canvas =document.getElementById("file_container");
					var ctx = canvas.getContext("2d");
					canvas.toBlobHD(function(blob) {
					    FileSaver.saveAs(blob, "pretty image.png");
					});
				});*/
				     // window.DelKateInvalidInfo();
				
	        	if(firstClick)
	        	{
			        firstClick=false;
			        	        $.ajax({url:self.HTML_FILE,success:function(data){			        	           
			        	             $(self.content).find('head').html(data);
			        	             $(self.content).find('body').html(self.DOBY_CONETENT);			        	             
			        	             self.InitInfo();
			        	          }});
			    }
			    else
			    {
				    self.InitInfo();
				}
				

				
	       });


        $('#file_export_save').click(function(){
        		 var cssData=$('#file_export_cssEditArea').html();
        		 localStorage.setItem(self.FILE_EXPORT_CSS_COOKIE_NAME,cssData);
        		 self.UpdateDefineCss(cssData);

        });
        $('#file_export_reset').click(function(){
             self.loadServerCss(false);
        });

         $('#file_export_exit').click(function(){
         	$('#file_export_container').css("visibility","hidden");
         });
         $('#file_export_gen_file').click(function(){
             this.fileName=$('#file_export_fileName').val();
             localStorage.setItem(self.FILE_EXPORT_NAME_COOKIE_NAME,this.fileName);
             this.fileName=this.fileName+$('#file_export_suffix').text();
             var htmlData="<!DOCTYPE html>"+"\n"+"<html>"+"\n"+$(self.content).find('html').html()+"\n"+"</html>";         
     		 var file = new  File([htmlData], this.fileName, {type: "text/html;charset=utf-8"});
	         FileSaver.saveAs(file);

         });
        
}



module.exports = ExportHtml;