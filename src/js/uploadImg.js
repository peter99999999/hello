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
    this.picServerConfig={"accesskey":"","secretkey":"","bucketname":"","bucketdomain":""};
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
    let observer = {
        next(res){
           // console.log('observer next ');
          
            $('.picPercentId').html("上传图片进度为："+ res.total.percent+"%");
           
        },
        error(err){
            let strhtml=$("#picture_error_popup").html();
            PopUp.showContent(strhtml);
        }, 
        complete(res){
            //console.log('observer complete ,the res.key is: '+res.key);
            let domain;
            if(0==self.picServerConfig.bucketdomain.indexOf("http"))
            {
                domain=self.picServerConfig.bucketdomain;
            }
            else
            {
                domain=HTTP_PREFIX+self.picServerConfig.bucketdomain;
            }
            $('textarea').insertAtCaret('![]('+domain+"/"+res.key+')');
            PopUp.hide();
            window.updateData();
        }
      }
    document.getElementById("editor").addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();	       
        for (let f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.name)     ;
        self.Upload(f,observer,self)
  
    }
      
  });
  document.getElementById("editor").addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
      });
   $("#picture").on("click",function()
    {
        let strhtml=$("#picture_popup").html();
        PopUp.showContent(strhtml);
        //$("#global_popup  .picSettingContainer").hide();
        let picServerConfigTmp=LocalStore.getValue(PIC_SERVER_SETTING);
       
            $(".accesskey").val(self.picServerConfig.accesskey);
            $(".secretkey").val(self.picServerConfig.secretkey);
            $(".bucketname").val(self.picServerConfig.bucketname);
            $(".bucketdomain").val(self.picServerConfig.bucketdomain);
       

        

    })
   
    $("#global_popup").on("click",".uploadPicBtnID",function(){
      //  $("#global_popup .picSettingContainer").toggle();
    })

   
    $("#global_popup").on("click",".savePicSetting",function(){
        self.picServerConfig.accesskey=MyStr.trim($(".accesskey").val());
        self.picServerConfig.secretkey=MyStr.trim($(".secretkey").val());
        self.picServerConfig.bucketname=MyStr.trim($(".bucketname").val());
        self.picServerConfig.bucketdomain=MyStr.trim($(".bucketdomain").val());
        let picServerInfoStr=JSON.stringify(self.picServerConfig);
        // Encrypt
        let picServerInfoStrEncrypt = CryptoJS.AES.encrypt(picServerInfoStr, SECRET_KEY);
        let picServerInfoStrEncryptStr= picServerInfoStrEncrypt.toString();
        LocalStore.setValue(PIC_SERVER_SETTING,picServerInfoStrEncryptStr);
    })


    $("#global_popup").on('change', "#uploadPicInputId",function (e) {
        let file = e.currentTarget.files[0];
        PopUp.hide();
        self.Upload(file,observer,self)
    })

    document.getElementById("editor").addEventListener("paste", function (e){
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
          self.Upload(pasteFile,observer,self)
         }
        }
       });
    
}


UploadImg.prototype.Upload = function (f,observer,self) {
    var putExtra = {
        fname: f.name,
        params: {},
        mimeType:["image/png", "image/jpeg", "image/gif","image/jpg","image/bmp"]
      };
      var config = {
        useCdnDomain: false,
      };
    
    var token = QiniuUPToken(self.picServerConfig.accesskey, self.picServerConfig.secretkey, self.picServerConfig.bucketname)
    //var observable = qiniu_js.upload(f, f.name, token, putExtra, config);
    var observable = qiniu_js.upload(f, null, token, putExtra, config);//当key为null时，返回的文件名为文件内容的hash值。
     
    var subscription = observable.subscribe(observer) ;// 上传开始 
    let strhtml=$("#picture_percent_popup").html();
    PopUp.showContent(strhtml);
    $('.picPercentId').html("正在上传图片......");
    
   
};

//var observable = qiniu.upload(file, key, token, putExtra, config)
//var subscription = observable.subscribe(observer) // 上传开始


module.exports = UploadImg;