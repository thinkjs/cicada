# cicada - favorite article collections

A favorite article collections application based on Node.js & [ThinkJS](https://github.com/75team/thinkjs).

抓取原网页的内容，分为完整版和简洁版，简洁版会去掉 HTML 里的 JS 和 CSS，这样即使原网页失效后也可以看到内容了。

`注`：如果原页面被墙了，抓取可能会失败。不能抓取需要登录的页面。

![](http://p0.qhimg.com/t016de9103f83648408.png)

## install

首先要安装 Node.js(>= 0.12.0) 的环境，然后通过下面的命令来安装 cicada：

```sh
git clone git@github.com:thinkjs-team/cicada.git
cd cicada;
npm install;
```

注：Kindle 推送服务需要使用 html-pdf 模块，它依赖的 phantomJS 模块因为网络问题会导致安装很慢，所以我默认把这个模块从依赖中去掉了，有需要 Kindle 推送服务的可以自行 `npm install html-pdf` 安装。

## 修改配置

修改配置文件 `src/common/config/config.js` 中的值：

```js
export default {
  port: 5678, //服务启动的端口
  protocol: 'http', //当前域名的协议
  token: 'TOKEN_VALUE', //token 值，第一次收藏的时候要填这个值进行校验
  website_title: 'welefen 的收藏' //收藏的 title
};
```

## 编译

```sh
npm run compile;
```

执行上面的命令进行代码编译。

## 使用 mysql 数据库

为了方便部署，默认使用的数据库为 `SQLite`。如果想使用 `mysql` 数据库的话，需要修改配置文件 `src/common/config/db.js` 中的值：

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

将 type 值修改为 `mysql`，并修改 adapter.mysql 里的对应配置。

建立 `cicada` 数据库，将 `mysql/cicada.sql` 文件导入到数据库中。


## 启动服务

以全局的方式安装 `pm2` 模块，安装完成后检查 pm2 命令是否存在。

修改 `pm2.json` 中的配置 `cwd` 值，修改为当前项目所在的路径。

使用 `pm2 startOrReload pm2.json` 命令来启动服务。

## 配置 nginx.conf

修改文件 `nginx.conf` 中对应的配置，将配置文件软链到 nginx 的配置文件目录中，然后 reload 下 nginx 配置。

## 添加书签

在网站底部将收藏书签拖拽到浏览器书签栏中。
