'use strict';
/**
 * config
 */
const {
  CI_TITLE,
  CI_TOKEN,
  CI_VISIBILITY,
  CI_KINDLE_ADDRESS
} = process.env;
export default {
  port: 5678, //service start port
  protocol: 'http', //domain protocol
  token: CI_TOKEN||'TOKEN_VALUE', //token to check before every operation
  website_title: CI_TITLE||'My Favorites', //site's title
  visibility: CI_VISIBILITY||'public', //set private to check token before view articles
  kindle: CI_KINDLE_ADDRESS||'hello_word@kindle.cn' //set send to kindle address
};
