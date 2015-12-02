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
    this.cookie('token', null, {
      timeout: 365 * 24 * 3600
    });
  }
}