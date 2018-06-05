// Author: Tomás Correia Marques
// GitHub: https://github.com/tomasmcm/figure-extension
//
//var showdown = require('../showdown');
/*! showdown-figure 04-12-2015 */
(function () {

  var figure = function (converter) {

    var fig = '<figure>' + '<img src="%1" alt="%2" title="%4">' + '<figcaption>%3</figcaption>' + '</figure>';
    var imgRegex = /(?:<p>)?<img.*?src="(.+?)".*?alt="(.*?)"(.*?)\/?>(?:<\/p>)?/gi;
    return [
      {
        type: 'output',
        filter: function (text, converter, options) {
          var tag = fig;

          return text.replace(imgRegex, function (match, url, alt, rest) {
            //return tag.replace('%1', url).replace('%2', alt).replace('%3', alt).replace('%4', alt);
            //gary update,解决当url中含有如%4这样的字符串时，会被上面的replace('%4', alt)替换的情况。/(.*)%1/是最后那个%1的意思。
            return tag.replace(/(.*)%1/, '$1'+url).replace(/(.*)%2/, '$1'+alt).replace(/(.*)%3/, '$1'+alt).replace(/(.*)%4/, '$1'+alt);
          });
        }
      }
    ];
  };
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.figure = figure; }
  if (typeof module !== 'undefined') module.exports = figure;

}());

//# sourceMappingURL=showdown-figure.js.map
