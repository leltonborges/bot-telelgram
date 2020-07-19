const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)


bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name} \nAvise se precisar de /ajuda`)
})

bot.command('ajuda', ctx => {
    ctx.reply(`/ajuda:  vou mostrar as opções
    /ajuda2: Para tester via hears
    /op2: Opção genéricac
    /op3: Outra opção genérica qualquer`)
})

bot.hears('/ajuda2', ctx => ctx.reply(
    `Eu também consigo capturar comandos
    mas ultilizer o /ajuda, que é o correto`
))

bot.hears(/\/op(2|3)/i, ctx => ctx.reply(
    `Resposta padrão para comandos genéricos`
))

bot.startPolling()