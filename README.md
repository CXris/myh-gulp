# myh-gulp

gulp 自动化构建工具命令封装。

### 简介

本依赖可以完成 HTML、SASS、LESS、ES6+代码的编译与压缩，图片压缩，以及浏览器 2080（可修改）端口的实时预览。

请通过 `"yarn add myh-gulp --dev"` 或 `"npm i myh-gulp -D"` 命令添加到项目的开发依赖。

### 使用

本依赖需要完成配置文件 _myhgulp.config.js_ ，在其中暴露一个数组 Data 作为项目具体数据。

默认的文件结构如下：

```
.
├── dist
│   └── assets
│       ├── fonts
│       ├── images
│       ├── scripts
│       └── styles
├── public
├── src
│   └── assets
│       ├── fonts
│       ├── images
│       ├── scripts
│       └── styles
├── index.html
└── temp
    └── assets
        ├── scripts
        └── styles
```

其中 `dist` 和 `temp` 文件夹为经本依赖处理后的文件，不是必需。
