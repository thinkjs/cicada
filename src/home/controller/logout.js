'use strict';
import Base from './base.js';

export default class extends Base {
  /**
   * index action
   */
  indexAction(){
    return this.redirect( this.referrer() );
  }
}
