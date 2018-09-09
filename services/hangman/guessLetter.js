module.exports = async function guessLetter (msg, letter) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let game = await this.data.hgetallAsync(gameKey)
  if (!game) return
  let guesses = await this.data.smembersAsync(`${gameKey}:guesses`)
  msg.delete().catch(() => {})
  game.wrong = +game.wrong
  if (guesses.includes(letter))
    return this.reply(msg, 'you\'ve said this letter already!')
  let indices = this.indicesOf(game.word, letter)
  if (indices.length) {
    game.state = game.state.split('')
    .map((c, i) => indices.includes(i) ? letter : c).join('')
    if (game.state === game.word) {
      this.reply(msg, 'correct, you\'ve won!!')
      let multiDel = this.data.multi()
      .del(gameKey)
      .del(`${gameKey}:guesses`)
      await multiDel.execAsync()
    } else {
      await this.data.hsetAsync(gameKey, 'state', game.state)
    }
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
    }
  }
  let theme = await this.getTheme(msg)
  await msg.channel.sendTyping()
  let gameFinished = game.wrong >= 6 || game.state === game.word
  if (game.theme !== theme) {
    game.theme = theme
    if (!gameFinished)
      await this.data.hset(gameKey, 'theme', theme)
  }
  if (!gameFinished) {
    guesses.push(letter)
    await this.data.saddAsync(`${gameKey}:guesses`, letter)
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
