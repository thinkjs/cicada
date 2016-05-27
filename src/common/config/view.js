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
        if(!env){
          return;
        }
        //添加一个过滤器，这样可以在模板里使用了
        env.addFilter("formatDate", function(datetime) {
          return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
        });
      }
    }
  }
};
