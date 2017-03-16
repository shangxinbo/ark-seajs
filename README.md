# 方舟私有云

### 方案
* node 借助 express 轻量服务器，监听3000端口，为静态资源提供服务容器，使前端开发完全脱离后端服务即可开发，保证前后端的并行
* 使用node 转发RESTful API,本地使用node 模块模拟数据，采用mockjs 产生随机数据
* 使用swig 模板引擎达到静态html的模板分割，使公共部分如头部尾部等公共不分模块化

### 脚本

* start

```
//启动本地mock数据进行纯前端开发，在项目开发初期使用
npm run start
//假数据在 /php/ 目录下，目录结构和深度和商定的接口格式一致，如接口是/project/add，对应的假数据应在'/php/project/add.js'文件中 
```

* dev

```
启动本地服务代理真实数据来联调数据使用，在前后端开发基本完成后项目联调阶段使用
npm run dev
```

* build

```
//发布代码，未压缩代码，可发布到测试环境
npm run build
or
gulp //如果本地全局装了gulp 即可使用该命令达到同样效果，全局安装gulp 请执行 `npm install -g gulp`
```

* release

```
//发布生产环境代码，会压缩并且加hash值，可发布到线上环境
npm run release
or
gulp --release
```

### 目录
如果使用该目录结构用于新项目，注意以下目录结构尽量不要变 
/bin 
/html  纯静态页，一般网页重构师（小龙）工作输出目录 
/php   mock数据 
/proxy 接口代理，node实现
/public 静态资源文件目录
/public/css 一般是第三方样式库
/public/img 
/public/js  主程序
/public/js/lib  第三方js类库
/public/js/seajs-config.js  sea.js的配置文件 
/public/less  自主编写的样式文件，小龙负责
/view      真实逻辑页面
/app.js    node服务器入口
/config.json  被加入.gitignore 每个人在本地配置的发布路径，和php程序的本地目录相关

