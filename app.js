const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const logger = require('koa-logger')
const proxy = require('koa-server-http-proxy')
const index = require('./routes/index')
// 代理接口
// app.use(proxy('/api', {
//   target: 'https://m.toutiao.com',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api': '/'
//   }
// }));
// SPA单页应用模板全部指向 '/'
// app.use(historyApiFallback({index:"/", whiteList: ['/api'] }));
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
app.use(index.routes())
.use(index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
