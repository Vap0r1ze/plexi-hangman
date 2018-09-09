module.exports = async function guessWord (msg, word) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let game = await this.data.hgetallAsync(gameKey)
  if (!game) return
  let guesses = await this.data.smembersAsync(`${gameKey}:guesses`)
  game.wrong = +game.wrong
  console.log(game.word, word)
  if (game.word === word) {
    this.reply(msg, 'correct, you\'ve won!!')
    game.state = word
    let multiDel = this.data.multi()
    .del(gameKey)
    .del(`${gameKey}:guesses`)
    await multiDel.execAsync()
  } else {
    game.wrong++
    if (game.wrong >= 6) {
      this.reply(msg, '**incorrect, GAME OVER!**', `The word was \`${game.word}\``)
      let multiDel = this.data.multi()
      .del(gameKey)
      .del(`${gameKey}:guesses`)
      await multiDel.execAsync()
    } else {
      await this.data.hincrbyAsync(gameKey, 'wrong', 1)
      this.reply(msg, 'incorrect, keep guessing!')
    }
  }
  await msg.channel.sendTyping()
  let gameFinished = game.wrong >= 6 || game.word === word
  let theme = await this.getTheme(msg)
  if (game.theme !== theme) {
    game.theme = theme
    if (!gameFinished)
      await this.data.hset(gameKey, 'theme', theme)
  }
  let image = this.canvas.drawGame(game, guesses)
  let vgyme = await this.vgyme.postImage(image)
  if (!gameFinished)
    await this.data.hsetAsync(gameKey, 'image', vgyme.image)
  this.client.editMessage(msg.channel.id, game.message, vgyme.image).catch(() => {
    msg.channel.createMessage(vgyme.image).then(gameMsg => {
      if (!gameFinished)
        this.data.hset(gameKey, 'message', gameMsg.id)
    }).catch(() => {})
  })
}
