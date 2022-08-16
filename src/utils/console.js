// 开发环境和生产环境是两套不一样的环境
// 开发环境时，console.log需要使用
// 生产环境不需要使用
// 让一套代码,在两个不同的环境自动生效
// nodejs在运行main.js代码时,node内全局内置变量process(固定)

// 解决:在服务器根目录下,可以新建环境变量配置文件(配置文件名称固定)
// .env.production
// .env.development

// 3.环境变量文件中,定义变量名NODE_ENV(固定) 自定义的变量名VUE_APP_变量名(固定)

// 使用npm run serve运行项目时,.env.development内的变量挂载在process.env上
// 使用 npm run build打包项目时,.env.production内的变量挂载在process.env上

// 如果当前的环境时生产环境,就将console.log覆盖为空
if (process.env.NODE_ENV === 'production') {
  console.log = function () {} // 覆盖所有打印语句
  console.dir = function () {}
  console.warning = function () {}
  console.error = function () {}
}
