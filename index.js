require('dotenv').config()

const Eris = require('eris')
const Logger = require('./services/Logger')
const utils = require('./utils')

const client = new Eris(process.env.TOKEN)
const data = require('./services/redis')(() => {
  // On redis connect
  client.connect()
})
const logger = new Logger('BOT')
const vgyme = require('./services/vgyme')
const canvas = require('./services/canvas')

const ctx = { ...utils, client, data, logger, vgyme, canvas }
const hangman = require('./services/hangman').bind(ctx)
const menus = require('./services/menus')

client.on('messageCreate', async msg => {
  if (msg.author.bot) return
  let openMenu = await data.getAsync(`menu:${msg.channel.id}:${msg.author.id}`)
  if (openMenu) {
    if (msg.content === 'cancel')
      return utils.closeMenu(msg)
    else
      return menus[openMenu].bind(ctx)(msg)
  }
  let prefix = process.env.PREFIX
  if (msg.content.length <= prefix.length || !msg.content.startsWith(prefix))
    return
  let args = msg.content.replace(process.env.PREFIX, '').split(' ').filter(Boolean)
  hangman(msg, args).catch(err => {
    logger.error(err)
  })
})
client.on('ready', () => {
  logger.log(`Logged into discord as ${client.user.username}#${client.user.discriminator}`)
  client.editStatus({ name: `${process.env.PREFIX}help` })
})
