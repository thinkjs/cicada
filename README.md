# cicada - favorite article collections

A favorite article collections application based on Node.js & [ThinkJS](https://github.com/75team/thinkjs).

Cicada can crawl content of target url to prevent can not view the contents of the original page because of failure. There has full version and concise version base on whether contains reference resources like JS and CSS.

Tips: Spider can't crawl page need login.

![](http://p1.qhimg.com/d/inn/3984d861/11.jpg)

## Installation

Confirm your Node.js version >= 0.12.0, then run following command:

```sh
git clone git@github.com:thinkjs-team/cicada.git
cd cicada;
npm install;
```

## Configuration

Modify `src/common/config/config.js`:

```js
export default {
  port: 5678, //service start port
  protocol: 'http', //domain protocol
  token: 'TOKEN_VALUE', //token to check before every operation
  website_title: 'welefen\'s favorites' //site's title
};
```

## Compile

```sh
npm run compile;
```

run this command to compile code.

## Use MySQL instead of SQLite

Default cicada uses SQLite to store data. If you want to use MySQL instead of SQLite, you should modify config file  `src/common/config/db.js`:

```js
export default {
  type: 'sqlite',
  name: 'cicada',
  prefix: 'ci_',
  encoding: 'utf8',
  nums_per_page: 10,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  },
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '',
      user: 'root',
      pwd: 'root'
    },
    sqlite: {
      path: think.ROOT_PATH + '/sqlite'
    }
  }
};
```
Change `type` value to `mysql`, and `adapter.mysql` with right mysql info.

Then you should create a database name cicada and import `mysql/cicada.sql` to it.

## Start service

Install `pm2` in global and run `pm2` to check if exists.

Modify `cwd` value to current cicada's path in `pm2.json` file.

run `pm2 startOrReload pm2.json` to start service.

## Config `nginx.conf`

Modify `nginx.conf` and soft link to nginx conf folder, then reload nginx.

## Add bookmark

```js
javascript:u%3Dlocation.href%3Bt%3Ddocument.title%3Bc %3D "" %2B (window.getSelection %3F window.getSelection() %3A document.getSelection %3F document.getSelection() %3A document.selection.createRange().text)%3Bvar url%3D"http%3A%2F%2Flocalhost:5678%2Farticle%2Fadd%3Ftitle%3D"%2BencodeURIComponent(t)%2B"%26url%3D"%2BencodeURIComponent(u)%2B"%26summary%3D"%2BencodeURIComponent(c)%3Bwindow.open(url%2C"_blank"%2C"scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes")%3B void 0
```
Replace `localhost:8360` to your domain in this url, and drag it to your browser bookmarks bar.
