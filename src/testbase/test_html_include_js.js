(function ( document, window, undefined) {
    var inFunction=function()
    {
     
        console.log("in gary_testJS function")
    }
    var inFunction_2=function()
    {
     
        console.log("in gary_testJS function 2")
    }
    console.log("i am been call immediatly")
    module.exports = {inFunction,inFunction_2};
   
 })( document, window);

 var function_a=function()
 {
    console.log("in function_a")
 }

 var function_b=function()
 {
    console.log("in function_b")
 }