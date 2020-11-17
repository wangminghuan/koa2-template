const router = require('@koa/router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
router.post('/json', async (ctx, next) => {
   ctx.body={
    code:0,
    data:{}
  }
})
module.exports = router
