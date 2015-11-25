# cicada

基于 ThinkJS 的个人收藏系统。

## install

```sh
git clone git@github.com:thinkjs-team/cicada.git
npm install
```

## 修改配置

修改配置文件 `src/common/config/config.js` 中的值：

```js
export default {
  token: 'TOKEN_VALUE', //token 值，收藏第一次填的值与之对应
  website_title: 'welefen 的收藏', //网站 title
};
```

## 编译

```sh
npm run compile
```

执行上面的命令进行代码编译。

## 启动服务

修改 `pm2.json` 中的配置 `cwd` 值，修改为当前项目所在的路径。

使用 `pm2 startOrReload pm2.json` 命令来启动服务。

## 配置 nginx.conf

修改文件 `nginx.conf` 中对应的配置，使用 nginx 做一层反向代理。

## 添加书签

```js
javascript:u%3Dlocation.href%3Bt%3Ddocument.title%3Bc %3D "" %2B (window.getSelection %3F window.getSelection() %3A document.getSelection %3F document.getSelection() %3A document.selection.createRange().text)%3Bvar url%3D"http%3A%2F%2Flocalhost:8360%2Farticle%2Fadd%3Ftitle%3D"%2BencodeURIComponent(t)%2B"%26url%3D"%2BencodeURIComponent(u)%2B"%26summary%3D"%2BencodeURIComponent(c)%3Bwindow.open(url%2C"_blank"%2C"scrollbars%3Dno%2Cwidth%3D800%2Cheight%3D500%2Cleft%3D75%2Ctop%3D20%2Cstatus%3Dno%2Cresizable%3Dyes")%3B void 0
```

将上面代码中的 `localhost:8360` 改为你的域名，然后选择代码并拖拽到浏览器书签中。


## 使用 mysql 数据库

默认使用的数据库为 `SQLite`，如果想使用 `mysql` 数据库的话，需要修改配置文件 `src/common/config/db.js` 中的值：

```js
export default {
  type: 'mysql', //使用 mysql 数据库
  host: '127.0.0.1',
  port: '',
  name: 'cicada', //数据库名
  user: 'root', //数据库帐号
  pwd: 'root', //数据库密码
  prefix: 'ci_',
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: true,
  log_connect: true,
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
```

将 `mysql/cicada.sql` 文件导入到数据库中。

