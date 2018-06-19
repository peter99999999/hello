var $ = require("jquery");
var html2canvas = require("./html2canvas.js");

var Katex2Img = function () {
  
   
};
/*
katex-display for block
katex for inline
*/
Katex2Img.convert=function()
{
    //$("#katex_icon").on("click",function(){
        $("#render_output_id .katex").each(function(){
            let self=this;
            let imgDom=$(this).children("img");
           // let thisDomS=$(this);
           // let thisDom=thisDomS[0]; 
            if(imgDom.length==0)
            {
                html2canvas($(this)[0]).then(function(canvas) {
                    //document.body.appendChild(canvas);
                    var dataURL = canvas.toDataURL();
                    //document.getElementById("test1_html2canvasoutput_img").src=dataURL;
                    var html=`<img src=${dataURL}>`
                    $(self).html(html);
                   
                });
            }
        })
    //})
}
module.exports = Katex2Img;