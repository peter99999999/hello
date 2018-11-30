import { isNullOrUndefined } from "util";
//import Config from "../common/config";
var Config = require("../common/config.js");
  //event.stopPropagation();//阻止mousedown 事件冒泡（注意只阻止了mousedown事件）
   //event.preventDefault();//阻止当前元素默认事件
   //if(ELECTRON_APP)
   //{
		var fs = require("fs");
		const PATH = require('path');
		const {dialog} = require('electron').remote;
		//var remote = require('electron').remote;
		//var fs = remote.require('fs');
		//var ipc = require('electron').ipcRenderer;
		//var dialog = require('electron').remote.dialog;
   //}
var $ = require("jquery");
var FileExplorer = function () {
	this.jsonObj={"grade":0,"fileName":"工作区目录","folder":true,"open":true,"basepath":"","fileson":[]};
	this.fileFunctionDom=null;
	this.fileID=0;
	this.dragSourceDom=null;
	this.RENAME_FILE="same_file_name";
	this.NEW_FILE_NAME="new_file_name";
	this.NOT_EXIST_FILE="not_exist_file";
	this.currentFile=null;//the current file full  path
	this.currentFileName=null;//only the file name;
	this.configObj={"filePaths":[]};
	this.FILE_DOM_CLASS="file_type";
	this.FILE_DOM_CLASS_DOT="."+this.FILE_DOM_CLASS;
	this.fileClickEnable=true;

    this.init();
    
};

FileExplorer.prototype.fileCompare=function(val1,val2){
	//return val1.fileName>val2.fileName;
	if(val1.fileName===val2.fileName)
			  {
				  return 0;
			  }
			  else if(val1.fileName>val2.fileName)
			  {
                 return 1;
			  }
			  else
			  {
				 return  -1;
			  }
};

FileExplorer.prototype.fs_addImportFiles= function(importFilepaths)
{
	let haveExist=false;
	let self=this;

	/* if(fs.existsSync(self.CONFIG_FILE))
	{
				    let str=fs.readFileSync(self.CONFIG_FILE)
					self.configObj = JSON.parse(str);
					if(isNullOrUndefined(self.configObj.filePaths))
					{
						self.configObj.filePaths=[];
					}
	} */
	self.configObj=Config.getInfo();
	for (let index in importFilepaths)
	{
		haveExist=false;
		for (let fileName of self.configObj.filePaths)
		{
			if(fileName==importFilepaths[index])
			{
				haveExist=true;
				break;
			}
		}
		if(!haveExist)
		{				
			if(
				fs.statSync(importFilepaths[index]).isDirectory()
				||
				(
					(!fs.statSync(importFilepaths[index]).isDirectory())
					&&
					self.IsFileNameOk(importFilepaths[index])
				)
			)
			{
				self.configObj.filePaths.push(importFilepaths[index]);//self.configObj.filePaths.splice(0,0,filepath);
				//fs.writeFileSync(self.CONFIG_FILE, JSON.stringify(self.configObj));
				Config.saveInfo(self.configObj);
				self.OpenCloseFolderData(self.fileFunctionDom,true);
				self.addImportFileToDisplayTree(importFilepaths[index],1);		
			}
		}

	}
	
}
FileExplorer.prototype.IsFileNameOk= function(filename)
{
	//return true;
	var reMd= /\.md$/;
	var reHtml= /\.html$/;
	var filenameLittle=filename.toLowerCase();
	if
	(
		reMd.test(filenameLittle)
		||
		reHtml.test(filenameLittle)
	)
	{
		return true;
	}
	else
	{
		return false;
	}
	
}

FileExplorer.prototype.RemoveFileBondData= function(dom)
{
	
	let parentNode;
	let index=0;
	let obj;
	obj=this.FindTheDomBondData(dom);
	parentNode=obj.parentNode;
	index=obj.index;
	parentNode.fileson.splice(index,1);
   
	
	
}
FileExplorer.prototype.unImportFolder= function(dom)
{
	let self=this;
	let thisNode=self.FindTheDomBondData(dom).node;
	let filePath=thisNode.basepath;
	
	for (let index in self.configObj.filePaths)
	{
		if(filePath==self.configObj.filePaths[index])
		{
			self.configObj.filePaths.splice(index,1);
			//fs.writeFileSync(self.CONFIG_FILE, JSON.stringify(self.configObj));
			Config.saveInfo(self.configObj);
			break;
		}
	}
	
}

FileExplorer.prototype.DisplayImportFolder= function()
{
	let self=this;
	if(ELECTRON_APP)
	{
		
	/* 	if(fs.existsSync(self.CONFIG_FILE))
		{
				    let str=fs.readFileSync(self.CONFIG_FILE)
					self.configObj = JSON.parse(str);
					if(isNullOrUndefined(self.configObj.filePaths))
					{
						self.configObj.filePaths=[];
					}
		} */
		self.configObj=Config.getInfo();
		for (let filePath of this.configObj.filePaths)
		{
			if(fs.existsSync(filePath))
			{
				self.addImportFileToDisplayTree(filePath,1);
			}
		}
		
	}
}
FileExplorer.prototype.getWorkSpaceDomRoot= function()
{
	let self=this;
	return $("#fileWindow").children(self.FILE_DOM_CLASS_DOT);
}
FileExplorer.prototype.getImportFileDomRoot= function()
{
	let self=this;
	return $("#fileWindow").children(self.FILE_DOM_CLASS_DOT ).children(self.FILE_DOM_CLASS_DOT );
}
FileExplorer.prototype.addImportFileToDisplayTree= function(filepath,grade)
{
	    let self=this;	
	    let newObj=new Object();
		newObj={"fileName":"a","folder":true,"open":true,"fileson":[]};
		self.jsonObj.fileson.splice(0,0,newObj);//self.jsonObj.fileson.push(newObj);
		self.BondFileTreeToData(filepath,self.jsonObj.fileson[0],grade);
		let str=self.BondDataToHtmlStr(self.jsonObj.fileson[0]);	
		if(self.jsonObj.fileson.length==1)	
		{
			self.getWorkSpaceDomRoot().append(str);
		}
		else
		{
			let findDom=self.getImportFileDomRoot().eq(0);
			$(findDom).before(str);
					
		}
		let triggerDom=self.getImportFileDomRoot().eq(0);
		$(triggerDom).find(".folder_item").each(function()
		{
			self.OpenCloseFolder(this,false);		           		  
		});
		
}




FileExplorer.prototype.init = function() {
	 //for file folder test
	      
           var self=this;
           
           $("#filewindow_popup").hide();
		   var array = ["a.md","aa.md","aaa.md","cc","b.md","b","bb.md","c.md","cc.md","ccc.md","d.md","g.md","gg.md"];
		   function compare(val1,val2){
			  // return val1-val2;
			  //return val1>val2;
			  if(val1===val2)
			  {
				  return 0;
			  }
			  else if(val1>val2)
			  {
                 return 1;
			  }
			  else
			  {
				 return  -1;
			  }
		   };
		   
		   document.getElementById("fileWindow").addEventListener('drop', function (e) {
			//$("#fileWindow").on('drop', function (e) {
				e.preventDefault();
				e.stopPropagation();	
				let paths=new Array();	
				for (let f of e.dataTransfer.files) {
				console.log('File(s) you dragged here: ', f.path)
				paths.push(f.path);
				}
				if(paths.length>0)
				{
					self.fs_addImportFiles(paths);
				}
		  });
		  document.getElementById("fileWindow").addEventListener('dragover', function (e) {
		//	$("#fileWindow").on('dragover', function (e) {
				e.preventDefault();
				e.stopPropagation();
		  });

		   array.sort(compare);//array.sort(compare);
		   self.initFileTreeDisplay();
            self.DisplayImportFolder();
           
           
          /*    $(".folder_item").each(function()
             {
				self.OpenCloseFolder (this,false);		   
				
			 });  */
			 
			
            this.eventHandleInit();  
               

          
   
         

          $("#filewindow_popup").bind("contextmenu", function(){//使右键无效，否则弹出此菜单时还会弹出浏览器默认的右键菜单
		  	return false;
		 }) 

		 $("#filewindow_popup").hover(
                  	function(){

                  	},
                  	function(){
						self.FilePopupWindowHide();
                  		self.UnSelect();

                  	}
          );

        

}

//<div class='popup_item delete_file'>删除文件夹</div><div class='popup_item add_folder'>增加文件夹</div><div class='popup_item rename_folder'>重命名文件夹</div>
FileExplorer.prototype.ToFileItemDom = function(triggerDom)
{
	let self=this;
	let parents;
	let parent;
	if($(triggerDom).hasClass(self.FILE_DOM_CLASS))
	{
		parent=triggerDom;
	}
	else
	{
		parents=$(triggerDom).parents(self.FILE_DOM_CLASS_DOT);
		parent=parents[0];
	}
	return parent ;
}
FileExplorer.prototype.ToParentFileItemDom = function(triggerDom)
{
	let parents;
	parents=$(triggerDom).parents(self.FILE_DOM_CLASS_DOT);
	return parents[0];
}

FileExplorer.prototype.FilePopupWindowHide = function()
{
	$("#filewindow_popup").hide();	
}

FileExplorer.prototype.RemoveTheDomAndBondData = function(triggerDom)
{
	let self=this;
	let fileParentDom=self.ToFileItemDom(self.fileFunctionDom);
	self.RemoveFileBondData(self.fileFunctionDom);
	$(fileParentDom).remove();
}
/* FileExplorer.prototype.ToFileItemSonDom = function(fileItemDom)
{
	let fileItemSonDom=$(fileItemDom).find(".file_item_display");//是让它去到子元素，使后面的$(triggerDom).parents(）拿到正确的值
	return fileItemSonDom;//注，当有兄弟时，返回值大于1，会出现问题。
} */

FileExplorer.prototype.FilePopupWindow = function(fileDom,mouseE) {
	let workspace_folderFuncS=[
		["导入文件夹到工作区","import_folder"],
		["导入文件到工作区","import_file"],
	 ];
	 let import_folderFuncS=[
		["增加文件","add_file"],
		["增加文件夹","add_folder"],
		["把此文件从工作区移除","unimport_folder"]
	 ];
	 let import_fileFuncS=[
		["把此文件从工作区移除","unimport_folder"]
	 ];
	let folderFuncS=[
	                   ["增加文件","add_file"],
	                  ["增加文件夹","add_folder"],
	                  ["移到回收站","delete_file"],
	                  ["重命名","rename_folder"]
	                ];
	let fileFuncS=[	                 
	                  ["移到回收站","delete_file"],
	                  ["重命名","rename_file"]
	                ];
	let funcsArray;
	var self=this;
	var xy={top:100,left:50};
    xy.top=mouseE.pageY;
    xy.left=mouseE.pageX;
	var str="";
	if($(fileDom).hasClass("import_folder"))
	{
		
			funcsArray=import_folderFuncS;
		
	}
	else if($(fileDom).hasClass("import_file"))
	{
		funcsArray=import_fileFuncS;
	}
    else if($(fileDom).hasClass("folder_item"))
    {
		if($(fileDom).hasClass("workspace_folder"))
		{
			funcsArray=workspace_folderFuncS;
		}
		else
		{
			funcsArray=folderFuncS;
		}
	   
	}
	else if($(fileDom).hasClass("file_item"))
	{
	    funcsArray=fileFuncS;
	}
	for(let i in funcsArray)
	{
	    	str=str+`<div class='popup_item ${funcsArray[i][1]}'>${funcsArray[i][0]}</div>`
	}

     $("#filewindow_popup").html(str);
    $("#filewindow_popup").show();
    $("#filewindow_popup").offset(xy);
	self.UnSelect();
	self.fileFunctionDom=fileDom;
	$(fileDom).addClass("item_select");
	$("#filewindow_popup .delete_file").click(function(){
                	
					 let obj=self.FindTheDomBondData(self.fileFunctionDom);
					 let path=obj.fullpath;
					//let path=obj.node.fullpath;
					//let parentPath=obj.parentNode.fullpath;
					self.fs_removeFileRecurse(path);
					
					self.RemoveTheDomAndBondData(self.fileFunctionDom);
					self.fileFunctionDom=null;
					self.FilePopupWindowHide();
	              

    }); 

    $("#filewindow_popup .add_folder,#filewindow_popup .add_file").click(function(){
    	            let folderFlag=false;
                    if($(this).hasClass("add_folder"))
                    {
                        folderFlag=true;
					}
					
					self.FilePopupWindowHide();
					self.LoadGlobalPopUp(self.NEW_FILE_NAME);
					
					
					if($(this).hasClass("add_file"))
					{
					//	$("#global_popup input").val(".md");
					}
					$("#global_popup input").focus();
    	            $("#global_popup input").on('input',function(){
    	            	$("#global_popup .warning").css("visibility","hidden");	
    	            }) ;
             	    $("#global_popup .confirm_btn").click(function(){
             	    	let newFileName=$("#global_popup input").val();
             	    	let nodeData=self.FindTheDomBondData(self.fileFunctionDom).node;
						
						 if(self.AddFileOrFolder(self.fileFunctionDom,newFileName,folderFlag))
						 {
								
							self.OpenCloseFolder(self.fileFunctionDom,true);	
							self.UnLoadGlobalPopUp(self.NEW_FILE_NAME); 	
						 }
						 else
             	    	{							
							$("#global_popup .warning").css("visibility","visible");	
							$("#global_popup input").focus();
						 }
                    	
                    });          	
                    $("#global_popup .cancel_btn").click(function(){
                    		self.UnLoadGlobalPopUp(self.NEW_FILE_NAME);
                     }); 
    }); 
    $("#filewindow_popup .rename_folder,#filewindow_popup .rename_file").click(function(){
    	            let fileNameBackup;
					let fileNameDom=$(self.fileFunctionDom).find(".file_name");
					let folder=true;
					let fileNameFormatOk=true;
					self.fileClickEnable=false;
					if($(this).hasClass("rename_file"))
					{
						folder=false;
					}
             	   fileNameBackup=$(fileNameDom).text();
             	   let htmlStr=`<input spellcheck="false" value=${fileNameDom.text()}>`;
             	   fileNameDom.html(htmlStr);  
             	   $(fileNameDom).find("input").focus().select();//让input框选中，并内容全选中
             	   self.FilePopupWindowHide(); 
             	    $(fileNameDom).find("input").blur(function(){
             	    	
             	    	let obj=self.FindTheDomBondData(fileNameDom);
             	    	let parent=obj.parentNode;
             	    	let inputText=$(fileNameDom).find("input").val();
						 let sameName=false;
						 self.fileClickEnable=true;
             	    	//sameName=self.existSameFileName(inputText,parent,obj.index);
						 if(!folder)
						 {
							if(!self.IsFileNameOk(inputText))
							{
								fileNameFormatOk=false;
							}
						 }
						 let oldPath=obj.fullpath;
						 let newPath=PATH.join(PATH.dirname(oldPath),inputText);
						 if((oldPath!=newPath)&&fileNameFormatOk&&self.fs_renameFile(oldPath,newPath))
						 {
						
							
							let fileItemDom=self.ToFileItemDom(self.fileFunctionDom);
						
							let parentFileDom=self.ToParentFileItemDom(fileItemDom);//$(fileItemDom).parents(".file_item_display");
						
							self.RenameFileOrFolder(parentFileDom,fileItemDom,inputText,oldPath,newPath);

						 }
						 else
						 {
						 	console.log("have same name");
                            self.LoadGlobalPopUp(self.RENAME_FILE);
                            $("#global_popup .confirm_btn").click(function(){
                            
                            	fileNameDom.text(fileNameBackup);  
                            	self.UnLoadGlobalPopUp(self.RENAME_FILE);
                            	 //$("#global_popup .confirm_btn").unbind();
                            	 //$(this).unbind();//将此事件解绑，否则可能会多次进入
                            	 //$("#global_popup").hide();
                            	 // $("#global_popup .popup_conetent").html("");
							})
						 }


             	    	
             	    		
             	    }) ;

	});   
	
	$("#filewindow_popup .import_folder").click(function(){
		self.FilePopupWindowHide();
		dialog.showOpenDialog({
			//defaultPath :os.homedir(),
			properties: [
			//   'openFile',
				'openDirectory', 
				'multiSelections'
			],
			filters: [
			//  { name: 'zby', extensions: ['json'] },
			]
		},function(res){
			if(!isNullOrUndefined(res)) 
			{
				self.fs_addImportFiles(res);							 
			}
		})
	})
	$("#filewindow_popup .import_file").click(function(){
		self.FilePopupWindowHide();
		dialog.showOpenDialog({
			//defaultPath :os.homedir(),
			properties: [
			   'openFile',
			//	'openDirectory', 
				'multiSelections'
			],
			filters: [
			  { name: 'markdown', extensions: ['md','html'] },
			]
		},function(res){
			if(!isNullOrUndefined(res)) 
			{
				self.fs_addImportFiles(res);							 
			}
		})
	})
	

	$("#filewindow_popup .unimport_folder").click(function(){
		self.FilePopupWindowHide();
		self.unImportFolder(self.fileFunctionDom);
		self.RemoveTheDomAndBondData(self.fileFunctionDom);
		self.fileFunctionDom=null;
	});
	

}
FileExplorer.prototype.existSameFileName = function(newFileName,parentNodeData,exceptIndex)
{
	 					let sameName=false;
	 					let fileName;
             	    	for(let i=0;i<parentNodeData.fileson.length;i++)
             	    	{
             	    		if(i!=exceptIndex)
             	    		{
             	    			fileName=parentNodeData.fileson[i].fileName;
             	    			if(fileName==newFileName)
             	    			{
             	    				sameName=true;
             	    				break;
             	    			}
             	    		}
             	    	}
             	    	return sameName;
}

FileExplorer.prototype.LoadGlobalPopUp = function(popCase,filepath="")
{
	let strhtml;
	let self=this;
	let warnComStr='请确认输入正确，如文件要以“.md"结尾，不能包含特殊字符，不能重名等!'
	if(popCase==this.NOT_EXIST_FILE)
	{
        warnComStr="不存在此文件："+filepath;
	}
	if(popCase==this.NEW_FILE_NAME)
	{
		strhtml=`
        <div class="new_file_name common_pop">
	        <div class="pop_text">请存入文件名：</div>
	        <input class="name_input" spellcheck="false" autofocus value="">
	        <div class="warning">${warnComStr}</div>
			<div class="btn_group">
				<button class="popup_btn confirm_btn">确定</button>
				<button class="popup_btn cancel_btn">取消</button>
			</div>
	    </div>
	   `;
	}
	else 
	{
		strhtml=`
        <div class="common_file_pop common_pop">
	        <div class="warning">${warnComStr}</div>
			<button class="popup_btn confirm_btn">确定</button>
	    </div>
	   `;
	}
	$("#global_popup .popup_conetent").html(strhtml);
	$("#global_popup").show();
	
	if(popCase==this.NOT_EXIST_FILE)
	{
		$("#global_popup .confirm_btn").click(function(){
				self.UnLoadGlobalPopUp();
		});
	}
}

FileExplorer.prototype.UnLoadGlobalPopUp = function(popCase="")
{
   $("#global_popup .popup_conetent").empty();//只删除被选元素的子元素
   $("#global_popup").hide();
}

FileExplorer.prototype.BondFileTreeToData=function(fullPath,dataJsonObj,grade)
{//把nodePath下所有的符合条件的文件，都挂在dataJsonObj下，dataJsonObj会先清掉
	let self=this;
	let dir=true;
	if(ELECTRON_APP)
	{
			
			//let folderName=PATH.basename(fullPath);
			let openDirBasePath=PATH.basename(fullPath);	
			//let newObj=new Object();
			//newObj={"fileName":folderName,"folder":true,"open":false,"fileson":[]};
			//dataJsonObj.fileson.splice(dataJsonObj.fileson.length,1,newObj);
			dataJsonObj.grade=grade;
			dataJsonObj.fileName=openDirBasePath;
			dataJsonObj.folder=true;
			dataJsonObj.open=false;
			if(grade==0)
			{
				dataJsonObj.basepath="";
			}
			else if(grade==1)
			{
				dataJsonObj.basepath=fullPath;
			}
			else
			{
				dataJsonObj.basepath=openDirBasePath;
			}
			dataJsonObj.fileson=[];//clear it at first
			console.log("the path is:"+fullPath+",and folder flag is:true");
			let fsArray=new Array();
			if(fs.existsSync(fullPath))
			{
				if(fs.statSync(fullPath).isDirectory())
				{
					fsArray=fs.readdirSync(fullPath);
				}
				else
				{
				
					dir=false;
				}

			}
			if(dir)
			{
					for(let sonPath of fsArray)
					{
						let fileRealPath;
						if(dir)
						{
							fileRealPath=PATH.join(fullPath,sonPath);//if don't join the path,the path will use the project workspace as the base path,which will make problem;
						}
						else
						{
							fileRealPath=sonPath;
						}
					
						if(fs.statSync(fileRealPath).isDirectory())
						{
							let newObj=new Object();
							//newObj={"fileName":"","folder":true,"open":false,"fullpath":fileRealPath,"fileson":[]};
							newObj={"fileName":sonPath,"folder":true,"open":false,"basepath":sonPath,"fileson":[]};
							dataJsonObj.fileson.push(newObj);
							this.BondFileTreeToData(fileRealPath,dataJsonObj.fileson[dataJsonObj.fileson.length-1],2);
						}
						else
						{
							console.log("the path is:"+fileRealPath+",and folder flag is:false");
							if(self.IsFileNameOk(sonPath))
							{
								let newObj=new Object();
								//newObj={"fileName":sonPath,"folder":false,"open":false,"fullpath":fileRealPath,"fileson":[]};
								newObj={"fileName":sonPath,"folder":false,"open":false,"basepath":sonPath,"fileson":[]};
								//dataJsonObj.fileson.fileson.splice(dataJsonObj.fileson.length,1,newObj);
								dataJsonObj.fileson.push(newObj);
							}
						

						}
						
						
					}
			}
			else
			{
				dataJsonObj.folder=false;
			}
			
			dataJsonObj.fileson.sort(self.fileCompare);
			

	}
}
FileExplorer.prototype.fs_renameFile=function(oldPath,newPath)
{
	
	let ok=true;
	try
	{
		fs.renameSync(oldPath, newPath)
	}
	catch(error)
	{
		ok=false;
	}
	return ok;
}


 FileExplorer.prototype.fs_removeFileRecurse=function(path)
{
	if(fs.existsSync(path))
	{
		if(fs.statSync(path).isDirectory())
		{
			let fsArray=fs.readdirSync(path);
			for(let fileName of fsArray)
			{
				let fileFullPath=PATH.join(path,fileName);
				if(fs.statSync(fileFullPath).isDirectory())
				{
					this.fs_removeFileRecurse(fileFullPath);
				}
				else
				{
					fs.unlinkSync(fileFullPath);  
				}
			}
			fs.rmdirSync(path);  
		}
		else
		{
			fs.unlinkSync(path); 
		}
	}
} 


FileExplorer.prototype.fs_addFile=function(isFolder,fileRealPath)
{
	let ok=true;
	if(ELECTRON_APP)
	{
		
		if(fs.existsSync(fileRealPath))
		{
			ok=false;
		}
		else
		{
			if(isFolder)
			{
				
				try
				{
					fs.mkdirSync(fileRealPath)
				}
				catch(error)
				{
					ok=false;
				}
			}
			else
			{
				
				try	
				{
					fs.writeFileSync(fileRealPath, "");
				}
				catch(error)
				{
					ok=false;
				}
				

			}
		}
	
	}
	return ok;
}
FileExplorer.prototype.UpdateCurFile= function(currentFile,currentFileName)
{
	this.currentFile=currentFile;
	this.currentFileName=currentFileName;
	$("#currentFile").html(this.currentFile);
}
FileExplorer.prototype.fs_openFile = function(fileDom)
{
	let self=this;
	if(ELECTRON_APP)
	{
		//let thisNode=this.FindTheDomBondData(fileDom).node;
		let obj=this.FindTheDomBondData(fileDom);
		if(self.currentFile!=obj.fullpath)
		{
			    if(self.currentFile!=null)
			    {
					window.saveEditData();
				}
				
				self.UpdateCurFile(obj.fullpath,$(fileDom).text());
				
				//console.log("the read data is:" +text );
					//console.log("fs test c");
		}
		if(fs.existsSync(self.currentFile))  	
				{			
					let data=fs.readFileSync(self.currentFile);				
					let text=data.toString();
					window.updateEditData(text);		
				}
				else
				{
					self.LoadGlobalPopUp(self.NOT_EXIST_FILE,self.currentFile);
				}
	}
}
FileExplorer.prototype.fs_saveFile = function(data)
{
	let ok=true;
	if(ELECTRON_APP)
	{
		if(fs.existsSync(this.currentFile))  
		{
			fs.writeFileSync(this.currentFile, data);
		}
		else
		{
			this.LoadGlobalPopUp(this.NOT_EXIST_FILE,this.currentFile);
			ok=false;
		}
	}
	return ok
}

FileExplorer.prototype.eventHandleInit = function() {
		var self=this;
	
		/* $(".folder_item,.file_item").bind("contextmenu", function(){//使默认的右键无效。
		  	return false;
		}) */
		$("#fileWindow").off("contextmenu",".folder_item,.file_item");//使默认的右键无效。
        $("#fileWindow").on("mousedown"," .folder_item, .file_item",function(e) {
			  
			//右键为3
			if (3 == e.which) 
			{
				
				   self.FilePopupWindow(this,e);
			} 
			else if (1 == e.which) 
			{
			  //左键为1
					  let i;
					  i=0;
					  if(self.fileClickEnable)
					  {
							if($(this).hasClass("folder_item"))
							{
									if($(this).hasClass("folder_close"))
										{
											self.OpenCloseFolder (this,true);		   
									
										}
										else if ($(this).hasClass("folder_open"))
										{
											self.OpenCloseFolder (this,false);		   
										
										}
									
							}
							else if($(this).hasClass("file_item"))
							{
								if(ELECTRON_APP)
								{//want to open the file
									self.fs_openFile(this);
								}
							} 
						}
						 

			}
	  });
		

		/* $("#fileWindow").on("drop",".file_item_display",function(ev)
		{
			let loopCount=0;
			let dropOk=true;	
			//let data=ev.originalEvent.dataTransfer.getData("dragID");
			let targetDom=$(this).parent();//ev.target;  //注意：用this而不要用ev.target，因为this指的是".file_item_display"，而ev.target可能是".file_item_display"下的子dom
			
            ev.preventDefault();	
		    	
		    if(self.isValidDrag(self.dragSourceDom,targetDom))
		    {
		    		$(targetDom).after($(self.dragSourceDom));
		    		let brotherS=$(targetDom).parent().find(self.FILE_DOM_CLASS_DOT);
		    		for(let i=0;i<brotherS.length;i++)
		    		{
		    			
		    			$(brotherS[i]).data("index",""+i);//注：用此jquery 的方法，虽然是改了data相应的值，但从dom上去看，并不会看到值的改变，因为jquery的data方法，只是改了其cache的值，如果想看到dom的变化，可采用$(test).attr("data-test","test")或原生的方法，如：test.setAttribute("data-html", "我是你");test.getAttribute("data-html");
		    			console.log("the index is:"+$(brotherS[i]).data("index"));
		    		}

		    }
		   
            $(this).removeClass("drag_over");

		    
		});

        $("#fileWindow").on("dragstart",".file_item_display",function(ev)
		{
			//ev.originalEvent.dataTransfer.setData("dragID",ev.target.id);
			self.dragSourceDom=$(this).parent();
			if($(this).hasClass("folder_item"))
			{
				            if ($(this).hasClass("folder_open"))
		               	    {
		               	    	 $(this).removeClass("folder_open");
		              		    $(this).addClass("folder_close");
		              		    $(this).siblings(self.FILE_DOM_CLASS_DOT).hide();
		              		    self.OpenCloseFolderData($(this),false);
		               	    }
		    }

		});

		$("#fileWindow").on("dragover",".file_item_display",function(ev)
		{
			ev.preventDefault();
		});

		$("#fileWindow").on("dragenter",".file_item_display",function(ev)
		{
			
			
		    if(self.isValidDrag(self.dragSourceDom,$(this).parent()))
			{
				$(this).addClass("drag_over");
			}
			
		});
		$("#fileWindow").on("dragleave",".file_item_display",function(ev)
		{
			
			$(this).removeClass("drag_over");
			 
		}); */
              
  


                  


               
};

FileExplorer.prototype.isValidDrag = function(sourceDom,targetDom) {
   if(this.isSameParent(sourceDom,targetDom))
   {
   	 
	  let sourceIndex=this.FindTheDomBondData(sourceDom).index;
	  let targetIndex=this.FindTheDomBondData(targetDom).index;
	  if((targetIndex+1)!=sourceIndex)
	  {
	  	return true;
	  }
	  else
	  {
	  	return false;
	  }
   }
   else
   {
   	 return false;
   }

}

FileExplorer.prototype.isSameParent = function(sourceDom,targetDom) {
	        let source_parent=$(sourceDom).parent();
		    let target_parent=$(targetDom).parent();
		    if(source_parent.is(target_parent))
		    {
		    	return true;
		    }
		    else
		    {
		    	return false;
		    }
}

FileExplorer.prototype.BondDataToHtmlStr_file = function(fileobj_s,fileName)
{
	let file_grade="";
	if(fileobj_s.grade==1)
	{
		file_grade="import_file";
	}
	let str=`<li class="${this.FILE_DOM_CLASS}"  ><span class="file_item file_item_display ${file_grade}" draggable="true"><span class="file_name">${fileName}</span></span></li>`;
   return str;  
}
FileExplorer.prototype.BondDataToHtmlStr = function(fileobj_s) {

           
	       let self=this;	   
		   let str="";
           let folderName=fileobj_s.fileName;
		   let folder_class="folder_item file_item_display";
		   let folder_status="";
		   let file_grade="";
           let idStr_pre="fileId_";
           let idStr="";
           let fileName=fileobj_s.fileName;
           //want to add the loop
            if(fileobj_s.folder==true)
            {
				for(var i in fileobj_s.fileson )
				{
							
					let fileobj=fileobj_s.fileson[i];
					fileName=fileobj.fileName;
					
					if(fileobj.folder==true)
					{
						str=str+this.BondDataToHtmlStr(fileobj);
					}
					else
					{	                 
						str=str+self.BondDataToHtmlStr_file(fileobj,fileName);
					}
				}

				if(fileobj_s.open)
				{
					folder_status="folder_open "
				}
				else
				{
					folder_status="folder_close";
				}
				if(fileobj_s.grade==0)
				{
					file_grade="workspace_folder"
				}
				else if(fileobj_s.grade==1)
				{
					file_grade="import_folder"
				}
				str=`<ul class="${self.FILE_DOM_CLASS}"   ><span class="${folder_class} ${folder_status} ${file_grade}" draggable="true"><span class="folder_status"></span><span class="folder"></span><span class="file_name">${folderName}</span></span>${str}</ul>`;
			}
			else
			{
				if(fileobj_s.grade==1)
				{
					file_grade="import_file"
				}
				str=self.BondDataToHtmlStr_file(fileobj_s,fileName);
			}             
            return str;
};
FileExplorer.prototype.UnSelect= function()
{
	if(this.fileFunctionDom!=null)
	{
		$(this.fileFunctionDom).removeClass("item_select");
	}
}
FileExplorer.prototype.OpenCloseFolder = function(triggerDom,open) {
	let self=this;	
	if($(triggerDom).hasClass("folder_item"))
	{		
	            if(open)
				{
	                        if($(triggerDom).hasClass("folder_close"))
							 {
								 $(triggerDom).removeClass("folder_close");
							 }
								$(triggerDom).addClass("folder_open");
								$(triggerDom).siblings(self.FILE_DOM_CLASS_DOT).show();
								self.OpenCloseFolderData($(triggerDom),true);
							 
				}
				else
				{
							 if ($(triggerDom).hasClass("folder_open"))
							 {
								  $(triggerDom).removeClass("folder_open");
							 }
								  $(triggerDom).addClass("folder_close");
								$(triggerDom).siblings(self.FILE_DOM_CLASS_DOT).hide();
								self.OpenCloseFolderData($(triggerDom),false);
							 
				}
	}


}

FileExplorer.prototype.OpenCloseFolderData = function(triggerDom,open) {
	 let thisNode;
	 thisNode=this.FindTheDomBondData(triggerDom).node;
	 thisNode.open=open;

}

FileExplorer.prototype.RenameFileOrFolder = function(parentDom,triggerDom,filename,oldPath,newPath)
{
	 let thisNode;
	 let self=this;
	 let ok=true;	
	 let obj=this.FindTheDomBondData(triggerDom);
	 thisNode=obj.node;
	 let parentNode=obj.parentNode;
	 
	 let fileRealPath="";
	 if(self.currentFile!=null)
	 {
		 if(0==self.currentFile.indexOf(oldPath))//如果修改的文件名的路径是当前打开的文件路径中的起始路径，要对“当前打开的文件路径”进行相应修改，否则会有错误
		 {
			let endPath=self.currentFile.substring(oldPath.length);
			let currentFile=PATH.join(newPath,endPath);
			self.UpdateCurFile(currentFile,filename);			
		 }
	 }
	 $(triggerDom).remove();
	 
		
		thisNode.fileName=filename;
		thisNode.basepath=filename;
		self.InsertDom(parentNode,thisNode,parentDom);
		
		
		

	
	 return ok;

}

FileExplorer.prototype.InsertDom=function(parentNode,thisNode,triggerDom)
{
	let self=this;
	parentNode.fileson.sort(self.fileCompare);
	let parentLen=parentNode.fileson.length;
	let nodeHtml=self.BondDataToHtmlStr(thisNode) ;
	for(let i in parentNode.fileson)
	{
			if(thisNode===parentNode.fileson[i])
			{
				
				let nearParent=self.ToFileItemDom(triggerDom);
				if(parentLen==1)
				{
					$(nearParent).append(nodeHtml);
				}
				else
				{
					if(i==0)
					{
						let findDom=$(nearParent).find(self.FILE_DOM_CLASS_DOT).eq(0);
						$(findDom).before(nodeHtml);
					}
					else
					{
						let findDom=$(nearParent).find(self.FILE_DOM_CLASS_DOT).eq(i-1);
						$(findDom).after(nodeHtml);
					}
					
				}
				
				break;
			}
	}
}

FileExplorer.prototype.AddFileOrFolder = function(triggerDom,filename,isFolder)
{
	 let thisNode;
	 let self=this;
	 let ok=true;	
	 let obj=this.FindTheDomBondData(triggerDom);
	 thisNode=obj.node;
	 let parentNode=thisNode;
	 let curFileSon=thisNode.fileson;
	 let fileRealPath="";
	 if(ELECTRON_APP)
	 {
		
			if(!isFolder)
			{
				ok=self.IsFileNameOk(filename);
			}
			if(ok)
			{
				fileRealPath=PATH.join(obj.fullpath,filename);
				ok=this.fs_addFile(isFolder,fileRealPath);
			}
		
	 }
	 if(ok)
	 { 
		
		 let newObj=new Object();
		 newObj={"grade":2,"fileName":filename,"folder":isFolder,"open":false,"basepath":filename,"fileson":[]};
		 parentNode.fileson.push(newObj);
         self.InsertDom(parentNode,newObj,triggerDom);
	 }
	 return ok;

}




FileExplorer.prototype.initFileTreeDisplay = function()
{
	let self=this;
	let str=self.BondDataToHtmlStr(self.jsonObj);
    $("#fileWindow").html(str);
				
                     
}

FileExplorer.prototype.FindTheDomBondData=function(triggerDom){
	 let self=this;
	 let parents=new Array();
	 let parents_2;
	 let newArray=new Array();
	 let thisNode;
	 let parentNode;
	 let index;
	 let fullpath="";
	
 	/*  if($(triggerDom).hasClass(self.FILE_DOM_CLASS))
	 {//注：这做法有问题，因为从父到子时，子可能不是唯一的。
		parents.push(triggerDom);
	 } */
	
	 
	parents=$(triggerDom).parents(self.FILE_DOM_CLASS_DOT);//查父节点的深度
	if($(triggerDom).hasClass(self.FILE_DOM_CLASS))
	{
		parents.splice(0,0,triggerDom);//要把这个dom也算进去,否则会漏这个
	}
	 
	 for(let i=0;i<parents.length;i++)
	 {//从最高层的父节点起，把要找节点到最高层父节点所经的每层对应的序号保存到newArray中
		 //newArray[i]=parseInt($(parents[parents.length-1-i]).data('index'));
		 let pres=$(parents[parents.length-1-i]).prevAll(self.FILE_DOM_CLASS_DOT);
		 newArray[i]=pres.length;
	 }
	 let preNode={"fileson":[]};
	 preNode.fileson[0]=this.jsonObj;
	 thisNode=preNode.fileson[0];
	 parentNode=preNode.fileson;
	 index=0;
	 for(let i=0;i<newArray.length;i++)//把dom转换为对应json数据
	 {
	 	thisNode= preNode.fileson[newArray[i]];
	 	parentNode=preNode;
		 index=newArray[i];
		 fullpath=PATH.join(fullpath,thisNode.basepath); 
	 	if(i+1==newArray.length)
	 	{
	 		break;
	 	}
	 	else
	 	{
			
			
			preNode=thisNode;
			 
	 	}
	 }
	 return {"node":thisNode,"parentNode":parentNode,"index":index,"fullpath":fullpath};

}

FileExplorer.prototype.GetCurrentFileName=function()
{
	return this.currentFileName;
}

module.exports = FileExplorer; 