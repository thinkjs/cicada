'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let data = await this.model('article').order('id DESC').limit(5).select();
    this.assign('articleList', data);
    this.type('application/javascript');
    return this.display();
  }
}
