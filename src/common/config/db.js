'use strict';
/**
 * db config
 * @type {Object}
 */
const {
  CI_DB_TYPE,
  CI_DB_DATABASE,
  CI_DB_PREFIX,
  CI_DB_ENCODING,
  CI_DB_NUMS_PER_PAGE,
  CI_DB_MYSQL_HOST,
  CI_DB_MYSQL_PORT,
  CI_DB_MYSQL_USER,
  CI_DB_MYSQL_PWD
} = process.env;

export default {
  type: CI_DB_TYPE||'sqlite',
  database: CI_DB_DATABASE||'cicada',
  prefix: CI_DB_PREFIX||'ci_',
  encoding: CI_DB_ENCODING||'utf8',
  nums_per_page: CI_DB_NUMS_PER_PAGE||10,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  },
  adapter: {
    mysql: {
      host: CI_DB_MYSQL_HOST||'127.0.0.1',
      port: CI_DB_MYSQL_PORT||'',
      user: CI_DB_MYSQL_USER||'root',
      pwd: CI_DB_MYSQL_PWD||'root'
    },
    sqlite: {
      path: think.ROOT_PATH + '/sqlite'
    }
  }
};