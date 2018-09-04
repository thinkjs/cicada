'use strict';

import url from 'url';
import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async listAction() {
    let where = {};
    let { keyword } = this.get();

    if (keyword && keyword.toLowerCase().indexOf('tag:') === 0) {
      //search by tag
      let tagdata = await this.model('tag').join({
        table: 'article_tag',
        join: 'inner',
        on: ['id', 'tag_id']
      })
        .where({ name: ['in', keyword.slice(4).split(',')] })
        .page(this.get('page'), 10).select();

      where.id = ['IN', tagdata.map(d => d.article_id).join()];

      keyword = '';
    }

    if (keyword) {
      where = {
        title: ['LIKE', `%${keyword}%`],
        summary: ['LIKE', `%${keyword}%`],
        _logic: 'OR'
      }
    }

    let data = await this.model('article').order('id DESC').where(where).page(this.get('page'), 10).countSelect(true);
    let bookmarksUrl = `void function(e, t, n, r, c, i, s, o, u) {
    n = location.href,
    r = t.title,
    c = t.documentElement.outerHTML,
    i = "" + (e.getSelection ? e.getSelection() : t.getSelection ? t.getSelection() : t.selection.createRange().text);
    if (!i) {
        o = t.getElementsByTagName("meta");
        for (var a = 0; a < o.length; a++) u = o[a],
        u && u.name.toLowerCase() === "description" && (i = u.content)
    }
    s = encodeURIComponent;
    var f = "${this.config('protocol')}://${this.http.host}/article/add?title=" + s(r) + "&url=" + s(n) + "&summary=" + s(i) + "#content=" + s(c);
    e.open(f, "_blank", "scrollbars=no,width=800,height=500,left=75,top=20,status=no,resizable=yes")
} (window, document);`;

    let notesUrl = `void function(e, t, n, r, c, i, s, o, u) {
    n = '/note/new', r = '' + (new Date).toLocaleString();
    s = encodeURIComponent;
    var f = "${this.config('protocol')}://${this.http.host}/article/add?title=" + s(r) + "&url=" + s(n);
    e.open(f, "_blank", "scrollbars=no,width=800,height=500,left=75,top=20,status=no,resizable=yes")
} (window, document);`;

    this.assign('articleList', data);
    this.assign('pagerData', data);
    this.assign('isLogin', this.cookie('token') === this.config('token'));
    this.assign('think', think);
    this.assign('bookmarks', 'javascript:' + encodeURIComponent(bookmarksUrl));
    this.assign('notemarks', 'javascript:' + encodeURIComponent(notesUrl));

    return this.display();
  }
  /**
   * add page
   */
  addAction() {
    let { url, tag } = this.get();
    if (url.startsWith('/note/')) {
      this.assign('isNote', true);
    }
    if (!tag && url.startsWith('/note/new')) {
      this.assign('tag', this.locale('note-tag'));
    } else {
      this.assign('tag', tag);
    }

    return this.display();
  }
  /**
   * edit page
   */
  async editAction() {
    let { id } = this.get();
    let model = this.model('article');
    let findData = await model.where({ id: id }).find();

    delete findData.snapshot;
    delete findData.create_time;

    findData.tag = findData.tag.map(o => o.name).join();

    let url = require('url').format({ pathname: '/article/add', query: findData });

    return this.redirect(url);
  }
  /**
   * add action
   */
  async saveAction() {
    let data = this.post();

    //article tags
    let tags = data.tag;
    if (tags) {
      tags = tags.split(',').map(item => item.trim());
    } else {
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
      { url: data.url }).catch(() => false);

    if (result === false) {
      return this.fail('SAVE_FAIL');
    }

    record.id = result.id;

    let isNote = data.url.startsWith('/note/');

    if (isNote) {
      record.url = '/note/' + record.id;
    }

    if (result.type === 'exist' || isNote) {
      await model.update(record);
    }

    this.snapshot(record.id, data.url, data.content);
    this.success();
  }

  snapshot(article_id, url, rawContent) {
    let service = this.service('spider');
    let spiderInstance = new service(url);
    let content_clean = spiderInstance.getCleanContent(rawContent);
    return spiderInstance.run().then(content => {
      if (content === 'error!') content = rawContent;
      return this.model('snapshot').thenAdd({ article_id, content, content_clean }, { article_id })
    });
  }
  /**
   * delete action
   */
  async deleteAction() {
    let id = this.get('id');
    try {
      await this.model('article').where({ id }).delete();
      await this.model('snapshot').where({ article_id: id }).delete();
      this.redirect(this.referrer() || '/');
    } catch (e) {
      console.error(e);
      return this.fail('DELETE_FAIL');
    }
  }
  /**
   * snapshot
   * @return {} []
   */
  async snapshotAction() {
    let id = this.get('id');
    let type = this.get('type');
    let field = type === 'clean' ? 'content_clean' : 'content';
    let snapPromise = this.model('snapshot').where({ article_id: id }).field(field).find();
    let infoPromise = this.model('article').setRelation(false).where({ id: id }).find();
    let [snap, info] = await Promise.all([snapPromise, infoPromise]);
    if (think.isEmpty(snap)) {
      return this.fail('ID_NOT_EXIST');
    }
    let content = snap[field];
    this.assign('content', content);
    this.assign('info', info);
    this.assign('isLogin', this.cookie('token') === this.config('token'));
    this.assign('prefix', (this.config('protocol') || 'http') + '://' + this.http.host);
    this.display();
  }

  async kindleAction() {
    let article_id = this.get('id');
    let snap = await this.model('snapshot').where({ article_id }).field('content').find();
    if (think.isEmpty(snap)) {
      return this.fail('ID_NOT_EXIST');
    }
    let service = this.service('kindle');
    let kindleInstance = new service(this.config('kindle'));

    return kindleInstance.run(snap.content).then(this.success.bind(this)).catch(this.fail.bind(this));
  }
}
