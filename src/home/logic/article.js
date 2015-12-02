'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * add action
   */
  addAction(){
    let token = this.cookie('token');
    let configToken = this.config('token');
    this.assign('showToken', token !== configToken);
  }
  /**
   * index action logic
   * @return {} []
   */
  saveAction(){
    let token = this.cookie('token');
    let configToken = this.config('token');
    if(token !== configToken){
      token = this.post('token');
      if(token !== configToken){
        return this.fail('token not valid');
      }
      //set token cookie
      this.cookie('token', token, {
        timeout: 365 * 24 * 3600
      });
    }
    this.rules = {
      'url': 'required',
      'title': 'required'
    }
  }
  /**
   * delete action logic
   */
  deleteAction() {
    let token = this.cookie('token');
    let configToken = this.config('token');
    if( token !== configToken ) {
      return this.fail('need login!');
    }

    this.rules = {
      'id': 'required|int'
    }
  }
  /**
   * snapshot
   * @return {} []
   */
  snapshotAction(){
    this.rules = {
      id: 'required|int'
    }
  }
}