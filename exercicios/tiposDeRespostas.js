const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}!😎`)
    await ctx.replyWithHTML(`Destacando mensagem <b>HTML</b>
    <i>de vários</i>
    <code>forma</code>
    <pre>Possíveis</pre>
    <a href="https://www.google.com">Google</a>`)
    await ctx.replyWithMarkdown('Destacando mensagen *MarkDown*'+
                                '_de várias_ `forma` ```possíveis```'+
                                '[Google](https://www.google.com)')
    await ctx.replyWithPhoto({source: `${__dirname}/abstract.jpg`})
    await ctx.replyWithPhoto('https://spring-ionic-lb.s3-sa-east-1.amazonaws.com/cat1.jpg', {caption: 'Olha o estilo!'})
    await ctx.replyWithPhoto({url: 'https://spring-ionic-lb.s3-sa-east-1.amazonaws.com/cat2.jpg'})
    await ctx.replyWithLocation(29.9773008, 31.1303068)
    await ctx.replyWithVideo('http://files.cod3r.com.br/curso-bot/cod3r-end.m4v')
})

bot.startPolling()