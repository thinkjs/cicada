'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let {id} = this.get();

    let note = await this.model('article').where({id}).find();

    if(note.id == null){
      return this.redirect('/');
    }

    let markdown = require('markdown').markdown;

    note.summary = markdown.toHTML(note.summary);

    this.assign('item', note);
    this.assign('think', think);
    this.assign('isLogin', this.cookie('token') === this.config('token'));

    return this.display();
  }
}