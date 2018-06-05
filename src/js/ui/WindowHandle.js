var $ = require("jquery");
window.WindowHandle_this;


//var this.gWindowWidth=1000;

var WindowHandle = function () {
	        window.WindowHandle_this=this;
            var dragIndicateWidth=$("#drag_indicate").css("width");
            if(ELECTRON_APP)
            {
              this.fileWindowWidth=200;
            }
            else
            {
              this.fileWindowWidth=0;
            }
            this.gMouseTrigerDrag=0;
            this.MINI_DISPLAY_WIDTH=220;
            this.gDragIndicateWidth=dragIndicateWidth.substr(0,dragIndicateWidth.length-2);//cut the "px" for example the 150px->150
            this.gDragIndicateWidth=parseInt(this.gDragIndicateWidth);

            this.init();
            window.onresize =this.DisplayWindowSize;
            this.DisplayWindowSize();
           //  drag_displaywindow_handle();
};

//function drag_displaywindow_handle()
WindowHandle.prototype.init = function() {
	 var dragIndicate_x,renderTransX,editor_width,renderArea_width;
      var self=this;
      $('*').mouseup(function(e) {
                if(self.gMouseTrigerDrag!=0)
                {
                  self.gMouseTrigerDrag=0;
                  $('#export_iframe_cover').css("width","0px");
                }
            });  
             $('#drag_indicate').mousedown(function(e) {
                self.gMouseTrigerDrag=1;
                $('#export_iframe_cover').css("width","100%");//用于盖着Iframe,否则，当Mouse在Iframe范围内时，收不到mouse相当的信息。
              //  $('#drag_indicate').css("transform","translate("+_x+"px,0px)");
            }); 
            $('#drag_indicate').mouseout(function(e) {
                if(self.gMouseTrigerDrag==1)
                {
                   self.gMouseTrigerDrag=2;
                }
            });
            $('*').mousemove(function(e) {
                   if(self.gMouseTrigerDrag==2)
                   {
                       dragIndicate_x=e.pageX;
                       renderTransX=e.pageX+self.gDragIndicateWidth;
                       editor_width=e.pageX-self.fileWindowWidth;
                       renderArea_width=self.gWindowWidth-renderTransX;
                       if
                        (
                           dragIndicate_x>self.MINI_DISPLAY_WIDTH+self.fileWindowWidth
                           &&
                           renderArea_width>self.MINI_DISPLAY_WIDTH
                        )
                        {
                         
                           self.UpdateEachWindowSize(self.fileWindowWidth,editor_width,renderArea_width);
                        }
                    }
            });   
}

/*WindowHandle.prototype.UpdateEachWindowSize = function(){

   $("#editor").css("width",editorWidth+"px");
   $("#cssSetting").css("width",editorWidth+"px");
   $("#file_export_setting").css("width",editorWidth+"px");

   $("#editor_render").css("width",editorRenderWidth+"px");
   $("#export_iframe_container").css("width",editorRenderWidth+"px");

   var renderTransX=parseInt(editorWidth)+parseInt(this.gDragIndicateWidth);
   $('#drag_indicate').css("transform","translate("+editorWidth+"px,0px)");
   $('#editor_render').css("transform","translate("+renderTransX+"px,0px)");
   $('#export_iframe_container').css("transform","translate("+renderTransX+"px,0px)");
}*/

     
WindowHandle.prototype.DisplayWindowSize=function() {
  var w=window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  var h=window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

   var display="浏览器的内部窗口宽度：" + w + "，高度：" + h + "。"
   
 window.WindowHandle_this.gWindowWidth=w;
 var foot_hight=$("#container_foot").css("height");
 foot_hight=foot_hight.substr(0,foot_hight.length-2);//cut the "px" for example the 150px->150
 var tool_hight=$(".tool_header").css("height");
 tool_hight=tool_hight.substr(0,tool_hight.length-2);//cut the "px" for example the 150px->150
 var display_hight=h-tool_hight-foot_hight;
 $("#display_area").css("height",display_hight+"px");
 $("#file_export_container").css("height",display_hight+"px");
 var footTop=h-foot_hight;
 $("#container_foot").css("top",footTop+"px");
 /*var height="";
 height=height+h+"px";
 $(".all_container").css("height",height);*/
 window.WindowHandle_this.UpdateDisplayAreaWidth(w);

}

WindowHandle.prototype.UpdateEachWindowSize=function(fileWindowWidth,editorWidth,editorRenderWidth)
{
   
   $("#fileWindow").css("width",fileWindowWidth+"px");
   $("#editor").css("width",editorWidth+"px");
   $("#cssSetting").css("width",editorWidth+"px");
   $("#file_export_setting").css("width",editorWidth+"px");

   $("#editor_render").css("width",editorRenderWidth+"px");
   $("#export_iframe_container").css("width",editorRenderWidth+"px");

   $('#editor').css("transform","translate("+fileWindowWidth+"px,0px)");
   $('#cssSetting').css("transform","translate("+fileWindowWidth+"px,0px)");
   $('#file_export_setting').css("transform","translate("+fileWindowWidth+"px,0px)");
   var renderTransX=parseInt(editorWidth)+parseInt(this.gDragIndicateWidth)+fileWindowWidth;
   var width=editorWidth+fileWindowWidth;
   $('#drag_indicate').css("transform","translate("+width+"px,0px)");
   $('#editor_render').css("transform","translate("+renderTransX+"px,0px)");
   $('#export_iframe_container').css("transform","translate("+renderTransX+"px,0px)");
}

WindowHandle.prototype.UpdateDisplayAreaWidth=function(windowWidth){
   var fileWindowWidth=this.fileWindowWidth;
   var editorWidth=(windowWidth-this.gDragIndicateWidth-this.fileWindowWidth)/2;
   var editorRenderWidth=windowWidth-editorWidth-this.gDragIndicateWidth-this.fileWindowWidth;
   this.UpdateEachWindowSize(fileWindowWidth,editorWidth,editorRenderWidth);
}

module.exports = WindowHandle;
