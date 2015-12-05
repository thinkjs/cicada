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
    let {keyword} = this.get();

    if(keyword && keyword.toLowerCase().indexOf('tag:') === 0){
      //search by tag
      let tagdata = await this.model('tag').join({
        table: 'article_tag',
        join: 'inner',
        on: ['id', 'tag_id']
      })
      .where({name: ['in', keyword.slice(4).split(',')]})
      .page(this.get('page'), 10).select();

      where.id = ['IN', tagdata.map(d => d.article_id).join()];

      keyword = '';
    }

    if(keyword){
      where = {
        title: ['LIKE', `%${keyword}%`],
        summary: ['LIKE', `%${keyword}%`],
        _logic: 'OR'
      }
    }

    let data = await this.model('article').order('id DESC').where(where).page(this.get('page'), 10).countSelect(true);

    this.assign('articleList', data);
    this.assign('pagerData', data);
    this.assign('isLogin', this.cookie('token') === this.config('token'));
    this.assign('bookmarks', 'javascript:void%20function(e%2Ct%2Cn%2Cr%2Ci%2Cs%2Co%2Cu)%7Bn%3Dlocation.href%2Cr%3Dt.title%2Ci%3D%22%22%2B(e.getSelection%3Fe.getSelection()%3At.getSelection%3Ft.getSelection()%3At.selection.createRange().text)%3Bif(!i)%7Bo%3Dt.getElementsByTagName(%22meta%22)%3Bfor(var%20a%3D0%3Ba%3Co.length%3Ba%2B%2B)u%3Do%5Ba%5D%2Cu%26%26u.name.toLowerCase()%3D%3D%3D%22description%22%26%26(i%3Du.content)%7Ds%3DencodeURIComponent%3Bvar%20f%3D%22http%3A%2F%2F'+this.http.host+'%2Farticle%2Fadd%3Ftitle%3D%22%2Bs(r)%2B%22%26url%3D%22%2Bs(n)%2B%22%26summary%3D%22%2Bs(i)%3Be.open(f%2C%22_blank%22%2C%22scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes%22)%7D(window%2Cdocument)');

    return this.display();
  }
  /**
   * add page
   */
  addAction(){
    return this.display();
  }
  /**
   * edit page
   */
  async editAction(){
    let {id} = this.get();
    let model = this.model('article');
    let findData = await model.where({id: id}).find();
    
    delete findData.snapshot;
    delete findData.create_time;

    findData.tag = findData.tag.map(o => o.name).join();

    let url = require('url').format({pathname: '/article/add', query: findData});

    return this.redirect(url);
  }
  /**
   * add action
   */
  async saveAction(){
    let data = this.post();

    //article tags
    let tags = data.tag;
    if(tags){
      tags = tags.split(',').map(item => item.trim());
    }else{
      tags = [];
    }

    let model = this.model('article');
    let record = {
      url: data.url,
      title: data.title,
      summary: data.summary,
      tag: tags,
    };

    let result = await model.thenAdd(record, 
      {url: data.url}).catch(() => false);

    if(result === false){
      return this.fail('SAVE_FAIL');
    }

    record.id = result.id;

    if(result.type === 'exist'){  
      await model.update(record);
    }

    this.snapshot(record.id, data.url);

    this.success();
  }
  snapshot(article_id, url){
    let service = this.service('spider');
    let spiderInstance = new service(url);
    think.await('save_snapshot_'+article_id, ()=>{
      return spiderInstance.run().then((contents) => {
        let snapshot = {
          article_id: article_id,
          content: contents.content,
          content_clean: contents.cleanContent
        }
        return this.model('snapshot').thenAdd(snapshot, {
          article_id: article_id
        });
      });
    });
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
