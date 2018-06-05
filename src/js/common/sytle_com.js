
var $ = require("jquery");
var Style_Com = function(){};

Style_Com.append=function(id)
{
     var head = document.head || document.getElementsByTagName('head')[0],                                 
     style = document.createElement('style');                                                                      
     style.type = 'text/css'; 
     style.id=id;                                                     
     head.appendChild(style);  
}

Style_Com.getIndex=function(id)
{
    var index=-1;
    for(var i=0;i<document.styleSheets.length;i++)
    {
        if(document.styleSheets[i].ownerNode.id==id)
        {
           index=i; 
           break;
        }
    }
    return index;
}

Style_Com.GetStyleSheet=function(index)
{
   var styleString='';
   if(index<document.styleSheets.length)
   {
     var ocssRules=document.styleSheets[index].cssRules || document.styleSheets[index].rules || window.CSSRule.STYLE_RULE; 
     var id=document.styleSheets[index].id;
      styleString = $.map(ocssRules, function(rule) {
                  var cssText= 'cssText' in rule ? rule.cssText : '';
                  return cssText;
               }).join("\n");
      //console.log('styleString:',styleString); 
   }
   return styleString;
}

Style_Com.GetStyleSheetWithID=function(id)
{
   var styleString='';
   var index=this.getIndex(id);
   if(index>=0)
   {
       styleString=this.GetStyleSheet(index);
   }
   return styleString;
}




Style_Com.AppendPrefixToAllRules=function(Prefix,id)
{
   var index=0;
   var styleString='';
   index=this.getIndex(id);
   //Prefix="";
   if(index>=0)
   {
    
     var selectorTextArry= new Array(); //定义一数组
     var selectorTextAll=''; 
     var ocssRules=document.styleSheets[index].cssRules || document.styleSheets[index].rules || window.CSSRule.STYLE_RULE; 
      styleString = $.map(ocssRules, function(rule) {             
                      selectorTextAll='';
                      selectorTextArry=rule.selectorText.split(","); //字符分割 如：h1,h2,h3
                      for (var i=0;i<selectorTextArry.length ;i++ ) 
                      { 
                         if(selectorTextArry[i].indexOf(Prefix)<0)
                         {
                              selectorTextAll=selectorTextAll+Prefix+" "+selectorTextArry[i];
                              
                         }
                         else
                         {
                              selectorTextAll=selectorTextAll+selectorTextArry[i];
                         }
                         if(i+1<selectorTextArry.length)
                         {
                                 selectorTextAll=selectorTextAll+",";
                         }
                         
                      } 
                      selectorTextAll=selectorTextAll+"{"+rule.style.cssText+"}\n";
                                    
                  return selectorTextAll;
               }).join("\n");
     
   }
   return styleString;
}



Style_Com.FindCssText=function(myRule,id)
{
   var index=0;
   var findRulesSty='';
   index=this.getIndex(id);
   if(index>=0)
   {
         var selectorTextArry= new Array(); //定义一数组
         var selectorTextAll=''; 
         var ocssRules=document.styleSheets[index].cssRules || document.styleSheets[index].rules || window.CSSRule.STYLE_RULE; 
         for(var i=0;i<ocssRules.length;i++)
         {
                          selectorTextArry=ocssRules[i].selectorText.split(","); //字符分割 如：h1,h2,h3
                          for (var j=0;j<selectorTextArry.length ;j++ ) 
                          { 
                             if(selectorTextArry[j]===myRule)
                             {
                                  findRulesSty=ocssRules[i].style.cssText;
                                  break;                                 
                             }
                                                         
                          }
                          if(findRulesSty !='')
                          {
                             break;
                          }
         }
         
   }
   return findRulesSty;
    
}

module.exports = Style_Com;