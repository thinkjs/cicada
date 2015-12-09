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
javascript:void%20function(e%2Ct%2Cn%2Cr%2Ci%2Cs%2Co%2Cu)%7Bn%3Dlocation.href%2Cr%3Dt.title%2Ci%3D%22%22%2B(e.getSelection%3Fe.getSelection()%3At.getSelection%3Ft.getSelection()%3At.selection.createRange().text)%3Bif(!i)%7Bo%3Dt.getElementsByTagName(%22meta%22)%3Bfor(var%20a%3D0%3Ba%3Co.length%3Ba%2B%2B)u%3Do%5Ba%5D%2Cu%26%26u.name.toLowerCase()%3D%3D%3D%22description%22%26%26(i%3Du.content)%7Ds%3DencodeURIComponent%3Bvar%20f%3D%22http%3A%2F%2Flocalhost:5678%2Farticle%2Fadd%3Ftitle%3D%22%2Bs(r)%2B%22%26url%3D%22%2Bs(n)%2B%22%26summary%3D%22%2Bs(i)%3Be.open(f%2C%22_blank%22%2C%22scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes%22)%7D(window%2Cdocument)%3B
```
Replace `localhost:5678` to your domain in this url, and drag it to your browser bookmarks bar.
