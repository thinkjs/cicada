'use strict';

import Base from './base.js';
/**
 * crontab
 */
export default class extends Base {
  /**
   * spider all urls
   * 
   * Usage: node www/production.js crontab/spider_all
   * 
   * @return {Promise} []
   */
  async spiderAllAction(){
    if(!think.cli){
      return this.fail('only invoked in command line');
    }
    let service = this.service('spider');
    let list = await this.model('article').setRelation(false).select();
    
    await think.parallelLimit(list, async item => {
      let data = await this.model('snapshot').where({article_id: item.id}).find();
      //content is exist;
      if(!think.isEmpty(data)){
        think.log(item.url + ' is exist');
        return;
      }
      let spiderInstance = new service(item.url);
      let contents = await spiderInstance.run();
      await this.model('snapshot').add({
        article_id: item.id,
        content: contents.content,
        content_clean: contents.cleanContent
      });
    }, {limit: 10});

    this.success();
  }
}