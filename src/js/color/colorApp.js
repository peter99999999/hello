var $ = require("jquery");
var Colors= require("./colors.js");
var ColorApp = function () {
  this.windowShow=false;
 
  this.init();
};

ColorApp.prototype.WindowToggle = function() {
    if(this.windowShow==false)
    {
        this.windowShow=true;
        $('#color_window_id').css("visibility","visible");

    }
    else
    {
        this.windowShow=false;
        $('#color_window_id').css("visibility","hidden");
   
    }

}

ColorApp.prototype.UpdateSelectColor = function(selectColor) {
                let colorSonHtml='';
               let each_color_collect = Colors[selectColor];
               for (let each_color_index in each_color_collect) {
                    let color_hex=each_color_collect[each_color_index].hex;
                    colorSonHtml=colorSonHtml+ '<span class="color_son" style="background:'+color_hex+'">'+color_hex+'</span>';
                    
               }           
               $(".color_son_container").html(colorSonHtml);
}
ColorApp.prototype.init = function() {
             let colorFatherHtml='';
            
             let self=this;
             //for (let hueName in Colors) 
             //for color father
           


            for (let colorName in Colors) 
            {
                 let each_color_collect = Colors[colorName];
                 
                 let each_father_indicate_color;
                 let each_color_index;
                 for ( each_color_index in each_color_collect) 
                 {
                     
                 }
                each_father_indicate_color=each_color_collect[each_color_index].hex;
                colorFatherHtml=colorFatherHtml+ '<span class="color_father" data-colorname='+colorName+' style="background:'+each_father_indicate_color+'"></span>'; 
            }
             $(".color_father_container").html(colorFatherHtml);


             //For color son
            this.UpdateSelectColor("red");
            $(".color_father").first().addClass("color_select");
           
            $('.color_father').click(function () {
                let colorName=$(this).data('colorname');     
                $('#color_name_id').text(colorName);      
                self.UpdateSelectColor(colorName);
                $('.color_father').each(function() {
                    $(this).removeClass("color_select");
                }); 
                $(this).addClass("color_select");
            });

            $('#color_ref').click(function(){
               self.WindowToggle();
            })
             $('#close_color_id').click(function(){
               self.WindowToggle();
            })
            
            


}

module.exports = ColorApp;
 