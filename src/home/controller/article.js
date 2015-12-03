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
    this.assign('bookmarks', 'javascript:u%3Dlocation.href%3Bt%3Ddocument.title%3Bc %3D "" %2B (window.getSelection %3F window.getSelection() %3A document.getSelection %3F document.getSelection() %3A document.selection.createRange().text)%3Bvar url%3D"http%3A%2F%2F'+ this.http.host +'%2Farticle%2Fadd%3Ftitle%3D"%2BencodeURIComponent(t)%2B"%26url%3D"%2BencodeURIComponent(u)%2B"%26summary%3D"%2BencodeURIComponent(c)%3Bwindow.open(url%2C"_blank"%2C"scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes")%3B void 0')
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
      return this.fail('SAVE_FAIL');
    }
    if(result.type === 'exist'){
      return this.fail('ARTICLE_EXISTS');
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
    if( !result ) return this.fail('DELETE_FAIL');
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
      return this.fail('ID_NOT_EXIST');
    }
    let content = snap[field];
    this.assign('content', content);
    this.assign('info', info);
    this.assign('prefix', (this.config('protocol') || 'http') + '://' + this.http.host);
    this.display();
  }
}
