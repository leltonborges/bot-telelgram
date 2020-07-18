const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(ctx => {
    const from = ctx.update.message.from
    console.log(from)
    if(from.id === 123){
        ctx.reply(`Ao seu dispor, mestre`)
    }else{
        ctx.reply(`Sinto muito, mas eu só falo com o meu mestre`)
    }
})

bot.startPolling()