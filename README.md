**测试后台管理系统，前端源码 [TS版本]。**

**项目说明**

本项目是基于typeScript + react-hooks搭建的一款后台管理系统demo。

**项目启动说明:**

1. 安装mongodb，并且启动mongodb服务。
2. 下载node后台代码。[**后台代码地址**](https://github.com/lmxyjy/admin_final)
3. 在下载后的后台代码根目录 `npm install` 安装依赖。
4. 在后台代码根目录 `npm start` 启动后台。
5. 下载本仓库前端代码
6. 在前端代码根目录`npm install` 安装所需依赖。
7. 在前端根目录`npm start`运行项目。 **

**项目技术选型:**

本次项目主要用到的技术是：

**主要编写语言：** TypeScript 。

**环境搭建:** React官方脚手架 create-react-app 。

**框架部分:** 选择了React新技术React-hooks。

**路由部分：** 选择了React-router。

**UI组件库:** 选择了Ant Design。

**数据请求:** 选择了axios 。

**项目图表部分:** 简单使用了echarts 。

**富文本编辑器部分:** 使用了react-draft-wysiwyg 。

**百度天气接口:** 使用了jsonp库做jsonp请求。

**项目开发过程中遇到的一些问题：**

[**项目练习记录：react-hooks中遇到的一些问题**](https://lmxyjy.github.io/react-hooks%E4%B8%AD%E7%9A%84%E4%B8%80%E4%BA%9B%E9%97%AE%E9%A2%98/)

**项目目录结构:**

![项目目录结构](src/assets/img/pages.png)

.
|-- src
|   |-- assets			图片静态资源
|   |-- components		
|   |   |-- common			公用组件
|   |   |   |-- header			公用头部组件
|   |   |   |-- menu			公用菜单组件
|   |   |   `-- slot-button  		公用自定义按钮
|   |   `-- no-found			加载出错时显示的组件
|   |-- config			公用菜单配置文件
|   |-- constant			常量文件
|   |-- network 			网络数据请求部分
|   |   |-- ajax.ts			axios封装的网络请求模块
|   |   `-- index.ts			封装的各个部分网络请求函数
|   |-- types	
|   |   |-- index.ts			部分公用的接口定义
|   |   `-- request-types.ts		请求数据部分的接口定义
|   |-- untils			工具函数部分
|   |   |-- addKey			给数据添加key值
|   |   |-- getTIme			处理当前时间函数
|   |   |-- localInfo			浏览器存储处理函数
|   |   `-- ramInfo			保存在内存中的用户信息
|   |-- views	
|       |-- admin			主页组件
|       |-- category			商品分类组件部分
|       |   |-- Category.tsx
|       |   |-- category-children		商品分类子组件
|       |   |   |-- Add.tsx		商品分类添加
|       |   |   `-- Update.tsx		商品分类更新
|       |   |-- category.css	
|       |   `-- categoryInter.ts		商品分类接口定义
|       |-- charts			图表显示组件
|       |   |-- Bar.tsx			柱形图
|       |   |-- Line.tsx			线型图
|       |   `-- Pie.tsx			饼图
|       |-- home			首页组件部分
|       |   |-- Home.tsx			首页组件
|       |   |-- bar.tsx			首页柱形图
|       |   `-- home.css		
|       |-- login			登陆组件部分
|       |   |-- Login.tsx			登陆组件
|       |   `-- login-children		登陆子组件
|       |       |-- LoginHeader.tsx		登陆头部组件
|       |       `-- login-children.css	
|       |-- product			商品管理部分
|       |   |-- Product.tsx		商品管理组件
|       |   |-- product-children		商品管理子组件
|       |   |   |-- PictureWall.tsx		图片添加组件
|       |   |   |-- ProductAdd.tsx		商品添加组件
|       |   |   |-- ProductDetail.tsx		商品详情组件
|       |   |   |-- ProductHome.tsx	 	商品首页组件
|       |   |   |-- RichTextEditor.tsx	商品富文本编辑器组件
|       |   |   `-- product-detail.css
|       |   `-- product-interface.ts 	商品管理接口定义
|       |-- role			角色管理部分
|       |   |-- Role.tsx			角色管理组件
|       |   |-- role-children		角色管理子组件
|       |   |   |-- add.tsx			添加角色组件
|       |   |   `-- auth.tsx		角色权限组件
|       |   `-- role-interface.ts		角色部分接口定义
|       `-- user			用户管理部分
|           |-- Add.tsx			用户添加组件
|           |-- User.tsx			用户组件
|           `-- user-interface.ts 		用户组件接口定义

