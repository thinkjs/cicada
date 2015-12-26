'use strict';
import Base from './base.js';
import fs from 'fs';
import path from 'path';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    this.assign('website_title', this.config('website_title'));
    this.assign('visibility', this.config('visibility'));
    this.assign('kindle', this.config('kindle'));
    return this.display();
  }

  saveAction() {
    if(this.post('website_title')) {
      this.config('website_title', this.post('website_title'));
    }
    if(this.post('visibility')) {
      this.config('visibility', this.post('visibility'));
    }
    if(this.post('newPassword')) {
      if(this.post('oldPassword') !== this.config('token')) {
        return this.fail('token error!');
      }

      if(this.post('newPassword') !== this.post('newPasswordAgain')) {
        return this.fail('new password set fail!');
      }

      this.config('token', this.post('newPassword'));
    }

    if(this.post('kindle')) {
      this.config('kindle', this.post('kindle'));
    }
    this.save();
    this.redirect(this.referrer());
  }

  save() {
    const configPath = path.join(think.ROOT_PATH, 'src/common/config/config.js');
    let content = `'use strict';
/**
 * config
 */
export default {
  port: ${this.config('port')}, //service start port
  protocol: '${this.config('protocol')}', //domain protocol
  token: '${this.config('token')}', //token to check before every operation
  website_title: '${this.config('website_title')}', //site's title
  visibility: '${this.config('visibility')}', //set private to check token before view articles
  kindle: '${this.config('kindle')}' //set send to kindle address
};`;

    fs.writeFileSync(configPath, content);
  }
}
