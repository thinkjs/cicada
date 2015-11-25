'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'sqlite',
  host: '127.0.0.1',
  port: '',
  name: 'cicada',
  user: 'root',
  pwd: 'root',
  prefix: 'ci_',
  encoding: 'utf8',
  nums_per_page: 10,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  },
  adapter: {
    mysql: {},
    sqlite: {
      path: think.ROOT_PATH + '/sqlite'
    }
  }
};