# cicada - favorite article collections

A favorite article collections application based on Node.js & [ThinkJS](https://github.com/75team/thinkjs).

Cicada can crawl content of target url to prevent can not view the contents of the original page because of failure. There has full version and concise version base on whether contains reference resources like JS and CSS.

Tips: Spider can't crawl page need login.

![](http://p0.qhimg.com/t012dd76cf28f85d67a.png)

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
  website_title: 'welefen\'s favorites', //site's title
  visibility: 'public'  //set private to check token before view articles
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
javascript:void function(e%2C t%2C n%2C r%2C c%2C i%2C s%2C o%2C u) %7B%0A    n %3D location.href%2C%0A    r %3D t.title%2C%0A    c %3D t.documentElement.outerHTML%2C%0A    i %3D "" %2B (e.getSelection %3F e.getSelection() %3A t.getSelection %3F t.getSelection() %3A t.selection.createRange().text)%3B%0A    if (!i) %7B%0A        o %3D t.getElementsByTagName("meta")%3B%0A        for (var a %3D 0%3B a < o.length%3B a%2B%2B) u %3D o%5Ba%5D%2C%0A        u %26%26 u.name.toLowerCase() %3D%3D%3D "description" %26%26 (i %3D u.content)%0A    %7D%0A    s %3D encodeURIComponent%3B%0A    var f %3D "http%3A%2F%2Flocalhost%3A5678%2Farticle%2Fadd%3Ftitle%3D" %2B s(r) %2B "%26url%3D" %2B s(n) %2B "%26summary%3D" %2B s(i) %2B "%23content%3D" %2B s(c)%3B%0A    e.open(f%2C "_blank"%2C "scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes")%0A%7D (window%2C document)%3B
```
Replace `localhost:5678` to your domain in this url, and drag it to your browser bookmarks bar.
