var $ = require("jquery");
var html2canvas = require("./html2canvas.js");
var PopUp= require("./ui/popup.js");
var canvg =require("./showdown-plugins/canvg/canvg.js");
var Katex2Img = function () {
  
   
};
/*
katex-display for block
katex for inline
*/


Katex2Img.convert=function()
{
    //$("#katex_icon").on("click",function(){
        //$("#render_output_id .katex-display").each(function(){
           
        var renderKatexNum=0;
            let renderCompleteKatexCount=0;
            let isChrome = false;
            let userAgent = navigator.userAgent;
            if((userAgent.indexOf("Chrome") > -1) && (userAgent.indexOf("Safari") > -1))
            {
                isChrome = true;
            }
            $("#render_output_id .katex").each(function(){
            let self=this;
            let imgDom=$(this).children("img");
           
           // if (isChrome)
            { 
                $(this).find('svg').each(function() {//svg convert to canvas
                    var orin_xml = (new XMLSerializer()).serializeToString(this);
                    var width=$(this).width();
                    var height=$(this).height();
                    width=""+width+"px";
                    height=""+height+"px";
                    $(this).width(width);
                    $(this).height(height);
                    //let xml=$(this).html();
                    var xml = (new XMLSerializer()).serializeToString(this);
                    
                    xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                    //draw the SVG onto a canvas
                    var canvas = document.createElement("canvas");
                    canvas.className = "screenShotTempCanvas";
                    canvg(canvas, xml);
                    $(canvas).insertAfter(this);
                    $(this).hide();
                });
            }
          
            
           // let thisDomS=$(this);
           // let thisDom=thisDomS[0]; 
           if(imgDom.length==0)
            {
                renderKatexNum++;
                if(renderKatexNum==1)
                {
                    PopUp.showCopyPopupContent("正在对Latex数学公式进行转换...<br/><br/><br/>");
                }
                html2canvas($(this)[0]).then(function(canvas) {
                    //document.body.appendChild(canvas);
                    //let dataURL = canvas.toDataURL("image/png",1.0);
                    let dataURL = canvas.toDataURL();
                    //document.getElementById("test1_html2canvasoutput_img").src=dataURL;
                    let html=`<img src=${dataURL} >`
                    $(self).html(html);
                    renderCompleteKatexCount++;
                    if(renderCompleteKatexCount==renderKatexNum)
                    {//have complete
                        PopUp.showCopyPopupContent(`Latex数学公式转换已完成，<strong><span class="warning">请再次点 "复制" </span></strong> 按键复制已包含转换公式后的内容<br/><br/>注：只当需要对Latex数学公式进行转换时才会弹出此窗口！`);
                    }
                   // document.execCommand('copy');
                   // $('#copy_btn').click();
                   
                });
            }
        })
    //})
}
module.exports = Katex2Img;