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
          let instance=this; 
          var renderKatexNum=0;
          let uploadHaveError=false;
          let uploadUrl="";
          let prefixBase64Img="data:image/png;base64,"
          const completeConvertText=`Latex数学公式已成功转换为本地图片<br/><br/>`;
          const completeUploadText=`Latex数学公式已转换为图片，并上传到云图床<br/><br/>`;
          const completeUploadFailText=`Latex数学公式已成功转换为本地图片<br/><strong><span class="warning">但上传到云图床时有错,所以还是使用了本地图片。请检查图床设置，或网络状态！</span></strong><br/><br/>`;
          const completeCommonText=`<strong><span class="warning">请再次点 "复制" </span></strong> 按键复制已包含转换公式后的内容<br/><br/>注：只当需要对Latex数学公式进行转换时才会弹出此窗口！`;
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
                    //dataURL=dataURL.substring(prefixBase64Img.length);
                    //document.getElementById("test1_html2canvasoutput_img").src=dataURL;
                    let html=`<img src=${dataURL} >`
                    $(self).html(html);
                   // instance.img2Qiniu(dataURL);
                   if(window.UploadImgInstance.isAutoUpload())
                   {//upload the base64 img to qiniu
                            
                            let pic = dataURL.substring(prefixBase64Img.length);
                        
                        
                           // var url = "http://up.qiniu.com/putb64/-1"; //非华东空间需要根据注意事项 1 修改上传域名
                           if(uploadUrl=="") 
                           {
                                uploadUrl=window.UploadImgInstance.GetUploadUrl();
                           }
                            let url = uploadUrl+"/putb64/-1";//非华东空间需要根据注意事项 1 修改上传域名
                            let xhr = new XMLHttpRequest();
                            let token=window.UploadImgInstance.GetToken();
                            
                         
                            xhr.onreadystatechange=function(){
                            if (xhr.readyState==4){
                            //  document.getElementById("myDiv").innerHTML=xhr.responseText;
                                console.log("The katex to qiniu response is :"+xhr.responseText)
                                try
                                {
                                    var reponseObj = JSON.parse(xhr.responseText); 
                                    if(reponseObj.hash!=null)
                                    {
                                        let qiniuImgUrl=window.UploadImgInstance.GetRealDomain();
                                        qiniuImgUrl=qiniuImgUrl+"/"+reponseObj.hash;
                                        let imgHtml=`<img src=${qiniuImgUrl} >`
                                        $(self).html(imgHtml);
                                    }
                                    else
                                    {
                                        uploadHaveError=true;    
                                    }
                                }
                                catch(error)
                                {
                                    uploadHaveError=true;   
                                }
                                renderCompleteKatexCount++;
                                if(renderCompleteKatexCount==renderKatexNum)
                                {//have complete
                                    if(uploadHaveError)
                                    {
                                        PopUp.showCopyPopupContent(completeUploadFailText+completeCommonText);
                                    }
                                    else
                                    {
                                        PopUp.showCopyPopupContent(completeUploadText+completeCommonText);
                                    }
                                }
                            }
                            }
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-Type", "application/octet-stream");  
                            xhr.setRequestHeader("Authorization","UpToken "+ token);
                            xhr.send(pic);
                    }
                    else
                    {
                                renderCompleteKatexCount++;
                                if(renderCompleteKatexCount==renderKatexNum)
                                {//have complete
                                    PopUp.showCopyPopupContent(completeConvertText+completeCommonText);
                                }
                    }
                   
                   
                 
                   
                });
            }
        })
    //})
}

module.exports = Katex2Img;