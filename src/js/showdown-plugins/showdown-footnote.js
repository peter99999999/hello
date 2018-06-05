var showdown = require('../showdown');

var converter = new showdown.Converter();

showdown.extension('footnote', function () {
  return [{
    type: 'lang',
   // type: 'listener',
    /*listeners: {
      'italicsAndBold.after': function (event, text, options, globals) {*/
    filter: function filter(text) {
      return text.replace(/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg, function (str, name, rawContent, _, padding) {
        var content = converter.makeHtml(rawContent.replace(new RegExp('^' + padding, 'gm'), ''));
        return '<div class="footnote" id="footnote-' + name + '"><a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>:' + content + '</div>';
      });
    }
  //}
  }, {
    type: 'lang',
    //type: 'listener',
    /*listeners: {
      'italicsAndBold.after': function (event, text, options, globals) {*/
    filter: function filter(text) {
      return text.replace(/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg, function (str, name, _, content) {
        return '<small class="footnote" id="footnote-' + name + '"><a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>: ' + content + '</small>';
      });
    
  }
  }, {
    //type: 'lang',
    type: 'listener',
    listeners: {
      'italicsAndBold.after': function (event, text, options, globals) {//gary，用监听此listeners的方法，避免在代码块在显示出问题，please check:https://github.com/showdownjs/showdown/issues/470
   // filter: function filter(text) {
      //return text.replace(/\[\^([\d\w]+)\]/m, function (str, name) {
      


        return text.replace(/\[\^([\d\w]+)\]/mg, function (str, name) {
        return '<a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>';
      });
      }
    }
  }];
});
