const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')
const bot = new Telegraf(env.token)

const tecladoOpcoes = Markup.keyboard([
    ['O que são bots?', 'O que verei no curso?'],
    ['Posso mesmo automatizar tarefas?'],
    ['Como comprar o curso?']
]).resize().oneTime().extra()

const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim','s'),
    Markup.callbackButton('Não', 'n')
], {columns: 3}))

const localizacao = Markup.keyboard([
    Markup.locationRequestButton('Clique aqui para enviar sua localização!')
]).resize().oneTime().extra()

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown (`*Ola, ${nome}!*\nEu sou o ChatBot do curso`)
    await ctx.replyWithPhoto('http://files.cod3r.com.br/curso-bot/bot.png')
    await ctx.replyWithMarkdown(`_Posso te ajudar em algo?_`, tecladoOpcoes)
})

bot.hears('O que são bots?', ctx => {
    ctx.replyWithMarkdown('Bots são blá, bla, blá...\n_Algo mais?_',tecladoOpcoes)
})

bot.hears('O que verei no curso?', async ctx => {
    await ctx.replyWithMarkdown('No *Curso*... também vamos criar _3 projetos_')
    await ctx.reply('1.')
    await ctx.reply('2.')
    await ctx.reply('3.')
    await ctx.replyWithMarkdown('\n\n_Algo mais?_', tecladoOpcoes)
})

bot.hears('Como comprar o curso?', async ctx => {
    await ctx.reply('Aqui...')
})

bot.hears('Posso mesmo automatizar tarefas?',async ctx => {
    await ctx.replyWithMarkdown('Sim, se isso não fosse possivél eu não existiria...\nQuer uma palhinha?', botoes)
})

bot.action('n', ctx => {
    ctx.reply('Ok, não precisa ser grosso 😓', tecladoOpcoes)
})

bot.action('s', ctx => {
    ctx.reply(`Que legal, tente me enviar a sua localização, ou escreve uma mensagem qulquer...`, localizacao)
})

bot.hears(/mensagem qualquer/i, async ctx => {
    await ctx.replyWithMarkdown(`Essa piada é velha, tenta outra...`, tecladoOpcoes)
})

bot.on('text', async ctx => {
    let msg = ctx.message.text
    msg = msg.split('').reverse().join('')
    await ctx.reply(`A sua mensagem ao contraria ficaria assim...`)
    await ctx.replyWithMarkdown(`_${msg}_`)
    await ctx.reply(`Show...`, tecladoOpcoes)
})

bot.on('location', async ctx => {
    try{
        const url = 'http://api.openweathermap.org/data/2.5/weather'
        const {
            latitude: lat,
            longitude: lon
        } = ctx.message.location
        console.log(lat, lon)
        const res = await axios.get(`${url}?lat=${lat}&lon=${lon}&APPID=820462c04e6f75445c4ce407e45881ee&units=metric`)
        await ctx.reply(`Hum... Você está em ${res.data.name}`)
        await ctx.reply(`A temperatura por ai é: ${res.data.main.temp}ºC`, tecladoOpcoes)
    }catch(e){
        await ctx.reply(`Estou tento problemas para saber sua localização
        Você esta no planeta terra?`, tecladoOpcoes)
    }
})

bot.startPolling()