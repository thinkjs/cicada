'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   */
  indexAction() {
  	if( this.cookie('token') !== this.config('token') ) {
  	  return this.redirect('/');
  	}
  }
}
