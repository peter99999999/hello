var $ = require("jquery");
var ScrollSync = function () {
  this.init();
};

   ScrollSync.prototype.init = function() {
            var editor_node,editor_render_node;
            var scrollTop;
            var editor_scroll=false;
            var editor_render_scroll=false;
           editor_node=document.getElementById("editor");
           editor_render_node=document.getElementById("editor_render");
           $("#editor").scroll(function(){                
              if(editor_render_scroll)
              {
                  editor_render_scroll=false;
              }
              else
              {
                 scrollTop=(editor_node.scrollTop*Math.max(editor_render_node.scrollHeight-editor_render_node.clientHeight,0))/(Math.max(editor_node.scrollHeight-editor_node.clientHeight,1));
                 editor_scroll=true;
                 $("#editor_render").scrollTop(scrollTop);
              }

             // node.scrollTop+render_node.clientHeight+1<=editor_render_node.scrollHeight
             //offsetHeight=clientHeight

           });
           $("#editor_render").scroll(function(){
               
               if(editor_scroll)
               {
                   editor_scroll=false; 
               }
               else
               {
                  scrollTop=(editor_render_node.scrollTop*Math.max(editor_node.scrollHeight-editor_node.clientHeight,0))/(Math.max(editor_render_node.scrollHeight-editor_render_node.clientHeight,1));
                  editor_render_scroll=true;
                  $("#editor").scrollTop(scrollTop);
                }
             

           });
}


module.exports = ScrollSync;