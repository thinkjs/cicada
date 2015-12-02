'use strict';

import url from 'url';
import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async listAction(){
    let where = {};
    let keyword = this.get('keyword');
    if(keyword){
      where = {
        title: ['LIKE', `%${keyword}%`],
        summary: ['LIKE', `%${keyword}%`],
        _logic: 'OR'
      }
    }
    let data = await this.model('article').order('id DESC').setRelation('tag').where(where).page(this.get('page'), 10).countSelect(true);
    this.assign('articleList', data);
    this.assign('pagerData', data);
    this.assign('isLogin', this.cookie('token') === this.config('token'));
    return this.display();
  }
  /**
   * add page
   */
  addAction(){
    return this.display();
  }
  /**
   * add action
   */
  async saveAction(){
    let data = this.post();
    let service = this.service('spider');
    let spiderInstance = new service(data.url);
    let contents = await spiderInstance.run();

    //article tags
    let tags = data.tag;
    if(tags){
      tags = tags.split(',').map(item => item.trim());
    }else{
      tags = [];
    }
    
    let model = this.model('article');
    let result = await model.thenAdd({
      url: data.url,
      title: data.title,
      summary: data.summary,
      tag: tags,
      snapshot: {
        content: contents.content,
        content_clean: contents.cleanContent
      }
    }, {url: data.url}).catch(() => false);
    if(result === false){
      return this.fail('save fail');
    }
    if(result.type === 'exist'){
      return this.fail('article exist');
    }
    this.success();
  }
  /**
   * delete action
   */
  async deleteAction() {
    let id = this.get('id');
    let model = this.model('article');
    let result = await model.where({id}).delete();
    if( !result ) return this.fail('delete fail');
    this.redirect( this.referrer() || '/' );
  }
  /**
   * snapshot
   * @return {} []
   */
  async snapshotAction(){
    let id = this.get('id');
    let type = this.get('type');
    let field = type === 'clean' ? 'content_clean' : 'content';
    let snapPromise = this.model('snapshot').where({article_id: id}).field(field).find();
    let infoPromise = this.model('article').setRelation(false).where({id: id}).find();
    let [snap, info] = await Promise.all([snapPromise, infoPromise]);
    if(think.isEmpty(snap)){
      return this.fail('id not exist');
    }
    let content = snap[field];
    this.assign('content', content);
    this.assign('info', info);
    this.assign('prefix', (this.config('protocol') || 'http') + '://' + this.http.host);
    this.display();
  }
}