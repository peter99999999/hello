var PopUp= require("./ui/popup.js");
var qiniu_js = require('qiniu-js');
var CryptoJS = require("crypto-js");
const SECRET_KEY="md2allverygood"
//var qiniu_server = require('qiniu')
var QiniuUPToken = require('qiniu-uptoken');
var insetCaret = require('./jquery.insert-at-caret.js')
var $ = require("jquery");
var LocalStore=require("./common/localstore.js");
var MyStr=require("./common/myStr.js");
const PIC_SERVER_SETTING="picserverconfig.json"; 
var UploadImg = function () {
    this.fileNum=0;
    this.fileCount=0;
    this.haveError=false;
    this.realDomain="";
    this.autoLoadTemp=false;
    this.uploadUrl="http://upload.qiniup.com";
    this.getUploadUrl=false;
    this.picServerConfig={"accesskey":"","secretkey":"","bucketname":"","bucketdomain":"","autoupload":false};
    this.Init();
};
const HTTP_PREFIX="http://"
UploadImg.prototype.Init=function()
{
   

    let self=this;

   

  
    let picServerConfigTmp=LocalStore.getValue(PIC_SERVER_SETTING);
    if(picServerConfigTmp!=null)
    {
        
        // Decrypt
        //let bytes  = CryptoJS.AES.decrypt(picServerConfigTmp, SECRET_KEY);
        try
        {
            let bytes  = CryptoJS.AES.decrypt(picServerConfigTmp, SECRET_KEY);
            let plaintext = bytes.toString(CryptoJS.enc.Utf8);
            try
            {
                let deStr=JSON.parse(plaintext);
                self.picServerConfig=deStr;
                self.autoLoadTemp=self.isAutoUpload();
                self.UpdateServerInfo();
            }
            catch(e)
            {
                let i;
                i=0;
            }
        }
        catch(e)
        {
            let i;
            i=0;
        }
        
      
    }

   

    
    document.getElementById("editor").addEventListener('drop', function (e) {
        let files;
        e.preventDefault();
        e.stopPropagation();	 
        files=e.dataTransfer.files;
        if(files.length>0)
        {
            self.PopUpInit(files.length);
            self.Upload(files,self)
        }      
  
    });
      
  
  document.getElementById("editor").addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
      });
   $("#picture").on("click",function()
    {
        let strhtml=$("#picture_setting_popup").html();
        PopUp.showContent(strhtml);
        //$("#global_popup  .picSettingContainer").hide();
        let picServerConfigTmp=LocalStore.getValue(PIC_SERVER_SETTING);
       
            $(".accesskey").val(self.picServerConfig.accesskey);
            $(".secretkey").val(self.picServerConfig.secretkey);
            $(".bucketname").val(self.picServerConfig.bucketname);
            $(".bucketdomain").val(self.picServerConfig.bucketdomain);
       
            self.autoLoadTemp=self.isAutoUpload();
            if(self.isAutoUpload())
            {
                $('.autouploadImgInput').prop("checked", true);
            }
            else
            {
                $('.autouploadImgInput').prop("checked", false); 
            }
           

    })

    $('#global_popup').on("click",".autouploadImgInput",function () {
         if ($(this).prop("checked")) {
            self.autoLoadTemp=true;
         } else {
            self.autoLoadTemp=false;
         }
     });
   
    $("#global_popup").on("click",".uploadPicBtnID",function(){
      //  $("#global_popup .picSettingContainer").toggle();
    })

   
    $("#global_popup").on("click",".savePicSetting",function(){
        self.picServerConfig.accesskey=MyStr.trim($(".accesskey").val());
        self.picServerConfig.secretkey=MyStr.trim($(".secretkey").val());
        self.picServerConfig.bucketname=MyStr.trim($(".bucketname").val());
        self.picServerConfig.bucketdomain=MyStr.trim($(".bucketdomain").val());
        self.picServerConfig.autoupload=self.autoLoadTemp;
        let picServerInfoStr=JSON.stringify(self.picServerConfig);
        self.UpdateServerInfo();
        // Encrypt
        let picServerInfoStrEncrypt = CryptoJS.AES.encrypt(picServerInfoStr, SECRET_KEY);
        let picServerInfoStrEncryptStr= picServerInfoStrEncrypt.toString();
        LocalStore.setValue(PIC_SERVER_SETTING,picServerInfoStrEncryptStr);
        window.updateData();

    })


    $("#global_popup").on('change', "#uploadPicInputId",function (e) {
        let files = e.currentTarget.files;
        PopUp.hide();
        if(files.length>0)
        {
            self.PopUpInit(files.length);
            self.Upload(files,self)
        }
    })

    document.getElementById("editor").addEventListener("paste", function (e){
        let files=[];
        let ii=0;
        if ( !(e.clipboardData && e.clipboardData.items) ) {
         return ;
        }
        
        for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
         var item = e.clipboardData.items[i];
        
         if (item.kind === "string") {
          item.getAsString(function (str) {
           // str 是获取到的字符串
          })
         } else if (item.kind === "file") {
          var pasteFile = item.getAsFile();
          // pasteFile就是获取到的文件
          files.push(pasteFile);
          
         }
        }
        
        if(files.length>0)
        {
            self.PopUpInit(files.length);
            self.Upload(files,self)
        }

       });
    
}
UploadImg.prototype.PopUpInit=function(fileNum)
{
  
    this.fileNum=fileNum;
    this.fileCount=0;    
    this.haveError=false;
    let strhtml=$("#picture_popup").html();
    PopUp.showContent(strhtml);
    $('#global_popup .picError').hide();
    $('#global_popup .closePopupContainerId').hide();
   
}
UploadImg.prototype.CheckComplete=function()
{
   this.fileCount++;
   if(this.fileCount==this.fileNum)
   {
       if(this.haveError)
       {
         $('#global_popup .picError').show();
         $('#global_popup .closePopupContainerId').show();
       }
       else
       {
        PopUp.hide();
       }
   }
}
UploadImg.prototype.Upload = function (files,self) {
    let Instance=this;
    let f;
    const UPLOAD_ERROR="<span class='warning'>上传失败!<span>"
    for(let i=0;i<files.length;i++ )
    {
                
                f=files[i];
                let index=0;
                let imgSrc=URL.createObjectURL(f);
                let findDom;
                let haveCallError=false;
                let haveInsertDom=false;
                let imgInfo;
               
                
                findDom=$('.picItems').find(".picticItem");
                index=findDom.length;

                
               
                    let observer = {
                        next(res){
                        // console.log('observer next ');
                        
                        findDom=$('#global_popup .picItems' ).find(".picticItem").eq(index);
                        findDom=$(findDom).find("lable");
                        let percentStr=""+res.total.percent;
                        if(percentStr.length>8)
                        {
                            percentStr=percentStr.substr(0,8)
                        }
                        $(findDom).html("上传图片进度为："+percentStr+"%");
                        
                        },
                        error(err){
                        // let strhtml=$("#picture_error_popup").html();
                        // PopUp.showContent(strhtml);
                            if(haveInsertDom)
                            {
                                findDom=$('#global_popup .picItems' ).find(".picticItem").eq(index);
                                findDom=$(findDom).find("lable");
                                $(findDom).html(UPLOAD_ERROR);
                            }
                            self.haveError=true;
                            self.CheckComplete();
                            haveCallError=true;
                            
                        }, 
                        complete(res){
                            //console.log('observer complete ,the res.key is: '+res.key);
                            let domain=Instance.realDomain;                           
                            $('textarea').insertAtCaret('![]('+domain+"/"+res.key+')\r');//if use \r\n,will find it effect the following content
                    //     PopUp.hide();
                            window.updateData();
                            self.CheckComplete();
                           
                        }
                    }
                    let putExtra = {
                        fname: f.name,
                        params: {"gary":"test"},
                        mimeType:["image/png", "image/jpeg", "image/gif","image/jpg","image/bmp"]
                    };
                    let config = {
                        useCdnDomain: false,
                    };
                    let token = QiniuUPToken(self.picServerConfig.accesskey, self.picServerConfig.secretkey, self.picServerConfig.bucketname)
                //var observable = qiniu_js.upload(f, f.name, token, putExtra, config);
                    let observable = qiniu_js.upload(f, null, token, putExtra, config);//当key为null时，返回的文件名为文件内容的hash值。
                    let subscription = observable.subscribe(observer);
                
                if(haveCallError)
                {
                    imgInfo=UPLOAD_ERROR;
                }
                else
                {
                    imgInfo="正在上传图片......";
                }

                let picItemHtml=`<div class='picticItem'><img src=${imgSrc}></img><lable>${imgInfo}</lable></div>`;
                
                $('#global_popup .picItems').append(picItemHtml);
               /*  if(0==index)
                {
                    $('#global_popup .picItems').append(picItemHtml);
                }
                else
                {
                    $('#global_popup  .picItems').find(".picticItem").last().after(picItemHtml);   
                
                } */
                haveInsertDom=true;
    }
   
};



//var observable = qiniu.upload(file, key, token, putExtra, config)
//var subscription = observable.subscribe(observer) // 上传开始
UploadImg.prototype.UpdateServerInfo=function()
{
    let self=this;
    self.ToRealBuckDomain();
    self.TestUploadUrl();
}
UploadImg.prototype.ToRealBuckDomain=function()
{
    let self=this;
    if(0==self.picServerConfig.bucketdomain.indexOf("http"))
    {
        self.realDomain=self.picServerConfig.bucketdomain;
    }
    else
    {
        self.realDomain=HTTP_PREFIX+self.picServerConfig.bucketdomain;
    }
}
UploadImg.prototype.GetToken=function()
{
    let self=this;
    let token = QiniuUPToken(self.picServerConfig.accesskey, self.picServerConfig.secretkey, self.picServerConfig.bucketname);
    return token;
}

UploadImg.prototype.GetRealDomain=function()
{
    let self=this;
    return self.realDomain;
}

UploadImg.prototype.TestUploadUrl=function()
{
    let self=this;
    let token=self.GetToken();
    self.getUploadUrl=false;
    var config = {
     useCdnDomain: true,
     region: null,
    //region: qiniu_js.region.z2,
   };                  
   
    try
    {//can catch even though have error
        qiniu_js.getUploadUrl(config, token).then(
            res => {
            self.uploadUrl=res;
            self.getUploadUrl=true;
            })
    }
    catch(error)
    {

    }

}
UploadImg.prototype.GetUploadUrl=function()
{
    let self=this;
    if(!self.getUploadUrl)
    {
        self.TestUploadUrl();
    }
    return self.uploadUrl;
}
UploadImg.prototype.isAutoUpload=function()
{
    let self=this;
    if((self.picServerConfig.autoupload==null)||(!self.picServerConfig.autoupload))
    {
        return false;
    }
    else
    {
        return true;
    }
}
module.exports = UploadImg;