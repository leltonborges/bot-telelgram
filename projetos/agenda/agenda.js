const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')
const {getAgenda,
    getTarefa,
    getTarefas,
    getConcluidas,
    incluirTarefa,
    concluirTarefa,
    excluirTarefa,
    atualizarDataTarefa,
    atualizarObsTarefa} = require('./agendaServicos')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const nome = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${nome}!`)
})

const formatarData = data =>
    data ? moment(data).format('DD/MM/YYYY') : ''

const exibirTarefa = async (ctx, tarefaId, novaMsg = false) => {
    const tarefa = await getTarefa(tarefaId)
    const conclusao = tarefa.dt_conclusao ?
        `\n<b>Concluída em:</b> ${formatarData(tarefa.dt_conclusao)}` : ''
    const msg = `
        <b>${tarefa.descricao}</b>\n<b>Previsão:</b> ${formatarData(tarefa.dt_previsao)}${conclusao}\n<b>Observações:</b>${tarefa.observacao || ''}
    `

    if (novaMsg) {
        ctx.reply(msg, botoesTarefa(tarefaId))
    } else {
        ctx.editMessageText(msg, botoesTarefa(tarefaId))
    }
}


const botoesAgenda = tarefas => {
    const botoes = tarefas.map(item => {
        const data = item.dt_previsao ?
            `${moment(item.dt_previsao).format('DD/MM/YYYY')} - ` : ''
        return [Markup.callbackButton(`${data}${item.descricao}`, `mostrar ${item.id}`)]
    })
    return Extra.markup(Markup.inlineKeyboard(botoes, { columns: 1 }))
}

const botoesTarefa = idTarefa => Extra.HTML().markup(
    Markup.inlineKeyboard([
        Markup.callbackButton('✔️', `concluir ${idTarefa}`),
        Markup.callbackButton('📅', `setData ${idTarefa}`),
        Markup.callbackButton('🗯️', `addNota ${idTarefa}`),
        Markup.callbackButton('✖️', `excluir ${idTarefa}`)
    ], {columns: 4})
)

//------------- Comandos do bot
bot.command('dia', async ctx => {
    const tarefas = await getAgenda(moment())
    ctx.reply(`Aqui está a sua agenda do dia`, botoesAgenda(tarefas))
})

bot.command('amanha', async ctx => {
    const tarefas = await getAgenda(moment().add({ day: 1}))
    ctx.reply(`Aqui está a sua agenda até amanhã`, botoesAgenda(tarefas))
})

bot.command('semana', async ctx => {
    const tarefas = await getAgenda(moment().add({ week: 1 }))
    ctx.reply(`Aqui está a sua agenda da semana`, botoesAgenda(tarefas))
})

bot.command('concluidas', async ctx => {
    const tarefas = await getConcluidas()
    ctx.reply(`Estas são as tarefas que você já concluiu`, botoesAgenda(tarefas))
})

bot.command('tarefas', async ctx => {
    const tarefas = await getTarefas()
    ctx.reply(`Aqui está a suas tarefas sem data definida`, botoesAgenda(tarefas))
})

//-------------- Actions do bot
bot.action(/mostrar (.+)/, async ctx => {
    await exibirTarefa(ctx, ctx.match[1])
})

bot.action(/concluir (.+)/, async ctx => {
    await concluirTarefa(ctx.match[1])
    await exibirTarefa(ctx, ctx.match[1])
    await ctx.reply('Tarefa concluída')
})

bot.action(/excluir (.+)/, async ctx => {
    await excluirTarefa(ctx.match[1])
    await ctx.editMessageText('Tarefa excluída')
})

// --------------- Inserir tarefa

bot.on('text', async ctx => {
    try{
        const tarefa = await incluirTarefa(ctx.update.message.text)
        await exibirTarefa(ctx, tarefa.id, true)
    }catch(error){
        console.log(err)
    }
})

bot.startPolling()