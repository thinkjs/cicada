'use strict';
import Base from './base.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import unzip from 'unzip';
import {version} from '../../../package.json';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    this.assign('website_title', this.config('website_title'));
    this.assign('visibility', this.config('visibility'));
    this.assign('kindle', this.config('kindle'));
    this.assign('version', version);

    let service = this.service('spider');
    let spiderInstance = new service('https://cdn.rawgit.com/thinkjs-team/cicada/master/package.json');
    let last = await spiderInstance.getContent();
    last = JSON.parse(last);
    if(this.compareVersion(version, last.version)) {
      this.assign('lastVersion', last.version);
    }
    return this.display();
  }

  compareVersion(now, last) {
    let parseVersion = version=>version.split('.').reverse().map((v,i)=>parseInt(v) * Math.pow(10, i)).reduce((a,b)=>a+b, 0);
    return parseVersion(last) > parseVersion(now);
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

  save(newConfig) {
    const configPath = path.join(think.ROOT_PATH, 'src/common/config/config.js');
    let newContent = '';
    if(newConfig) {
      newContent = newConfig.map(con => `${con}: '${this.config(con)}',`).join('\n');
    }
    let content = `'use strict';
/**
 * config
 */
export default {
  ${newContent}
  port: ${this.config('port')}, //service start port
  protocol: '${this.config('protocol')}', //domain protocol
  token: '${this.config('token')}', //token to check before every operation
  website_title: '${this.config('website_title')}', //site's title
  visibility: '${this.config('visibility')}', //set private to check token before view articles
  kindle: '${this.config('kindle')}' //set send to kindle address
};`;

    fs.writeFileSync(configPath, content);
  }

  async updateAction() {
    try {
      let file = await this.download();
      fs.createReadStream(file).pipe(unzip.Extract({path: think.RESOURCE_PATH}));
      this.updateConfig();
      this.updateSQL();
      this.updateFiles();
      this.unlinkSync( path.join(think.RESOURCE_PATH, 'master.zip') );
      setTimeout(this.success.bind(this), 5000);
    } catch(e) {
      this.fail(e);
    }
  }
  updateFiles() {
    let mv = this.npm('mv');
    mv( path.join(think.RESOURCE_PATH, 'cicada-master/*'), think.ROOT_PATH );
    fs.unlinkSync( path.join(think.RESOURCE_PATH, 'cicada-master') );
  }
  /** Update **/
  updateSQL() {
    var db = this.require( path.join(think.ROOT_PATH, 'src/common/config/db.js') );
    switch(db.type.toLowerCase()) {
      case 'sqlite': updateSQLite(); break;
      case 'mysql' : updateMySQL(); break;
    }

    function updateSQLite() {
      this.unlinkSync( path.join(think.RESOURCE_PATH, 'cicada-master/sqlite/cicada.sqlite') );
    }
    function updateMySQL() {

    }
  }
  updateConfig() {
    var lastConfigPath = path.join(think.RESOURCE_PATH, 'cicada-master/src/common/config/config.js');
    var lastConfig = this.require( lastConfigPath );
    var newConfig = Object.keys(lastConfig).filter(con => !this.config(con));
    if(newConfig.length>0) {
      newConfig.forEach( con => this.config(con, lastConfig[con]));
      this.save(newConfig);
      fs.unlinkSync(lastConfigPath);
    }
  }
  async download() {
    var filePath = path.join(think.RESOURCE_PATH, 'master.zip');
    var file = fs.createWriteStream(filePath);
    return new Promise( (resolve, reject) => {
      var req = https.request({
        hostname: 'codeload.github.com',
        port    : 443,
        path    : '/thinkjs-team/cicada/zip/master',
        method  : 'GET'
      }, function(res) {
        res.on('data', function(d) {
          file.write(d);
          resolve(filePath);
        });
      });
      req.on('error', reject);
      req.end();
    });
  }
}
