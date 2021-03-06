module.exports = async function quitGame (msg) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let game = await this.data.hgetallAsync(gameKey)
  if (!(game && game.topic))
    return this.reply(msg, 'you\'re not in a game!')
  let guesses = await this.data.smembersAsync(`${gameKey}:guesses`)
  let multiDel = this.data.multi()
  .del(gameKey)
  .del(`${gameKey}:guesses`)
  await multiDel.execAsync()
  game.wrong = 6
  this.reply(msg, 'you\'ve quit the game')
  await msg.channel.sendTyping()
  game.theme = await this.getTheme(msg)
  let image = this.canvas.drawGame(game, guesses)
  let vgyme = await this.vgyme.postImage(image)
  this.client.editMessage(msg.channel.id, game.message, vgyme.image).catch(() => {
    msg.channel.createMessage(vgyme.image).catch(() => {})
  })
}
