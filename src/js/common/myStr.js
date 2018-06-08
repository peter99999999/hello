
var MyStr = function(){
 
};

MyStr.trim= function(str)
{
    return str.replace(/^\s+|\s+$/gm,'');
}
module.exports = MyStr;
