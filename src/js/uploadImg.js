var qiniu_js = require('qiniu-js')
//var qiniu_server = require('qiniu')
var QiniuUPToken = require('qiniu-uptoken');
var insetCaret = require('./jquery.insert-at-caret.js')
var $ = require("jquery");
var LocalStore=require("./common/localstore.js");
const PIC_SERVER_SETTING="picserverconfig.json"; 
var UploadImg = function () {
    this.picServerConfig={"accesskey":"","secretkey":"","bucketname":"","bucketdomain":""};
    this.Init();
};

UploadImg.prototype.Init=function()
{
    let self=this;
    document.getElementById("editor").addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();	       
        for (let f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.name)     ;
        var putExtra = {
            fname: f.name,
            params: {},
            mimeType:["image/png", "image/jpeg", "image/gif"]
          };
          var config = {
            useCdnDomain: false,
          };
        
        var token = QiniuUPToken(self.picServerConfig.accesskey, self.picServerConfig.secretkey, self.picServerConfig.bucketname)
        var observable = qiniu_js.upload(f, f.name, token, putExtra, config);
        var observer = {
            next(res){
                console.log('observer next ');
            },
            error(err){
                console.log('observer error ');
            }, 
            complete(res){
                console.log('observer complete ,the res.key is: '+res.key);
                $('textarea').insertAtCaret('![]('+self.picServerConfig.bucketdomain+"/"+res.key+')');
            }
          }
         try
         {
             var subscription = observable.subscribe(observer) ;// 上传开始 
         }
         catch(error)
         {
             let i;
             i=0;
         }
        }
      
  });
  document.getElementById("editor").addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
      });
   $("#picture").on("click",function()
    {
        let strhtml=$("#picture_popup").html();
        $("#global_popup .popup_conetent").html(strhtml);
        $("#global_popup").show();
        //$("#global_popup  .picSettingContainer").hide();
        let picServerConfigTmp=LocalStore.getValue(PIC_SERVER_SETTING);
        if(picServerConfigTmp!=null)
        {
            self.picServerConfig=JSON.parse(picServerConfigTmp);
            $(".accesskey").val(self.picServerConfig.accesskey);
            $(".secretkey").val(self.picServerConfig.secretkey);
            $(".bucketname").val(self.picServerConfig.bucketname);
            $(".bucketdomain").val(self.picServerConfig.bucketdomain);
        }

        

    })
   
    $("#global_popup").on("click",".uploadPicBtnID",function(){
      //  $("#global_popup .picSettingContainer").toggle();
    })

    $("#global_popup").on("click",".close_pic_id",function(){
        $("#global_popup .popup_conetent").html("");
	    $("#global_popup").hide();
    })
    $("#global_popup").on("click",".savePicSetting",function(){
        let accesskey=$(".accesskey").val();
        let secretkey=$(".secretkey").val();
        let bucketname=$(".bucketname").val();
        let bucketdomain=$(".bucketdomain").val();
        let picServerInfo={"accesskey":accesskey,"secretkey":secretkey,"bucketname":bucketname,"bucketdomain":bucketdomain};
        let picServerInfoStr=JSON.stringify(picServerInfo);
        LocalStore.setValue(PIC_SERVER_SETTING,picServerInfoStr);
    })
    
}


UploadImg.prototype.Upload = function (file) {

   
};

//var observable = qiniu.upload(file, key, token, putExtra, config)
//var subscription = observable.subscribe(observer) // 上传开始


module.exports = UploadImg;