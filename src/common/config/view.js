'use strict';
/**
 * template config
 */
import moment from 'moment';
export default {
  type: 'nunjucks',
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '_',
  root_path: think.ROOT_PATH + '/view',
  adapter: {
    nunjucks: {
      prerender: function(nunjucks, env){
        //添加一个过滤器，这样可以在模板里使用了
        env.addFilter("formatDate", function(datetime) {
          return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
        });
        env.addFilter("pageUrl", function(page, querys){
          var htmlMaps = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quote;',
            "'": '&#39;'
          }
          var escape_html = function (str) {
            return (str + "").replace(/[<>'"]/g, function(a){
              return htmlMaps[a];
            })
          }
          var prefix = "?";
          var querys = [];
          for(var name in querys){
            if(name == 'page') continue;
            querys.push(escape_html(name) + '=' + escape_html(querys[name]));
          }
          prefix += querys.join("&");
          if(querys.length){
            prefix += "&";
          }
          return `${prefix}page=${page}`;
        });
      }
    }
  }
};
