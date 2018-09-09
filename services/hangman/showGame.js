module.exports = async function showGame (msg) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let game = await this.data.hgetallAsync(gameKey)
  if (!game)
    return this.reply(msg, 'you\'re not in a game!')
  let guesses = await this.data.smembersAsync(`${gameKey}:guesses`)
  this.client.editMessage(msg.channel.id, game.message, `<${game.image}>`).catch(() => {})
  await msg.channel.sendTyping()
  let pomf = game
  let theme = await this.getTheme(msg)
  if (process.env.ENV === 'dev' || game.theme !== theme) {
    game.wrong = +game.wrong
    game.theme = theme
    let image = this.canvas.drawGame(game, guesses)
    pomf = await this.pomf.postImage(image)
    let multi = this.data.multi()
    .hset(gameKey, 'image', pomf.image)
    .hset(gameKey, 'theme', theme)
    await multi.execAsync()
  }
  msg.channel.createMessage(pomf.image).then(async gameMsg => {
    await this.data.hsetAsync(gameKey, 'message', gameMsg.id)
  }).catch(() => {})
}
