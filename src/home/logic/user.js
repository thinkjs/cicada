'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * login action logic
   */
  loginAction() {
  	if( this.cookie('token') === this.config('token') ) {
  	  return this.redirect('/');
  	}
  }
  /**
   * logout action logic
   */
  logoutAction() {
    this.cookie('token', null, {
      timeout: 365 * 24 * 3600
    });
  }
}
