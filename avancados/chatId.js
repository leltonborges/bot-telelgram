const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(ctx => {
    console.log(ctx.chat.id === ctx.update.message.from.id)
    console.log(ctx.update.message.entities)
    console.log(ctx.update.message.from.id)
})

bot.on('message', ctx => {
    console.log(ctx)
})

bot.startPolling()