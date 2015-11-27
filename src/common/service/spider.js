'use strict';

import url from 'url';
import request from 'request';
import path from 'path';
import iconvLite from 'iconv-lite';

/**
 * charset regexp
 * @type {RegExp}
 */
const CHARSET_REGEXP = /charset=['"]?(gbk|gb2312|utf8|utf\-8)['"]?/i;
/**
 * spider article content
 */
export default class extends think.service.base {
  /**
   * timeout
   * @type {Number}
   */
  timeout = 10; // 10 s
  /**
   * userAgent
   * @type {String}
   */
  userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36';
  /**
   * init
   * @param  {String} url []
   * @return {}     []
   */
  init(url){
    this.url = url;
  }
  /**
   * get url content
   * @return {} []
   */
  getContent(){
    let fn = think.promisify(request.get, request);
    return fn({
      url: this.url,
      strictSSL: false,
      timeout: this.timeout * 1000,
      encoding: null,
      headers: {
        'User-Agent': this.userAgent
      }
    }).then(response => {
      let content = response.body.toString();
      let encoding = this.getEncoding(content, response.headers);
      if(encoding === 'gb2312'){
        content = iconvLite.decode(response.body, 'gb2312');
      }
      //remove charset meta
      content = content.replace(CHARSET_REGEXP, '');
      return content;
    }).catch(() => {
      return 'error!';
    });
  }
  /**
   * get content encoding
   * @param  {String} content []
   * @param  {Object} headers []
   * @return {String}         []
   */
  getEncoding(content, headers){
    for(let name in headers){
      if (name.toLowerCase()  === 'content-type') {
        let value = headers[name].toLowerCase();
        if (value.indexOf('charset') > -1) {
          if (value.indexOf('gbk') > -1 || value.indexOf('gb2312') > -1) {
            return 'gb2312';
          }else{
            return 'utf8';
          }
        };
        break;
      };
    }
    let matches = content.match(CHARSET_REGEXP);
    if (matches) {
      let charset = matches[1].toLowerCase();
      if (charset === 'gbk') {
        charset = 'gb2312';
      }
      return charset;
    };
    return 'utf8';
  }
  /**
   * get clean content
   * @param  {String} content []
   * @return {String}         []
   */
  getCleanContent(content){
    content = content.replace(/<script[^><]*>[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<noscript[^><]*>[\s\S]*?<\/noscript>/gi, '');
    content = content.replace(/<style[^><]*>[\s\S]*?<\/style>/gi, '');
    content = content.replace(/<link[^><]*>/gi, '');
    content = content.replace(/<html[^<>]*>/i, '').replace(/<\/html>/i, '');
    return content;
  }
  /**
   * set base meta for content
   * @param {String} content []
   */
  setBaseMeta(content){
    let prefix = this.url;
    let urlInfo = url.parse(this.url);
    let reg = /<base [^<>]*href=([\'\"]?)([^\'\"]+)\1[^<>]*>/i;
    let matches = content.match(reg);
    if(matches){
      let href = matches[2].toLowerCase();
      if(href.indexOf('http://') === 0 || href.indexOf('https://') === 0 || href.indexOf('//') === 0){
        prefix = href;
      }else if(href){
        let value = path.resolve(urlInfo.pathname, href);
        prefix = urlInfo.protocol + '//' + urlInfo.host + value;
      }
      content = content.replace(reg, '');
    }
    content = content.replace(/<head[^<>]*>/i, a => {
      return `${a}\n<base href="${prefix}" />`;
    });
    return content;
  }
  /**
   * run
   * @return {} []
   */
  async run(){
    if(!this.url){
      throw new Error(`url must be set`);
    }
    let content = await this.getContent();
    content = this.setBaseMeta(content);
    let cleanContent = this.getCleanContent(content);
    return {
      content,
      cleanContent
    }
  }
}