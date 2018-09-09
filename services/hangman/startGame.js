const topics = require('../../topics')

module.exports = async function startGame (msg) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let isGame = await this.data.existsAsync(gameKey)
  if (isGame)
    return this.reply(msg, 'you\'re already in a game!')
  await msg.channel.sendTyping()
  let topic = this.sample(Object.keys(topics))
  let word = this.sample(topics[topic])
  let game = {
    topic,
    word,
    state: word.replace(/\w/g, '_'),
    wrong: 0,
    theme: await this.getTheme(msg)
  }
  let multi = this.data.multi()
  .hset(gameKey, 'topic', topic)
  .hset(gameKey, 'word', word)
  .hset(gameKey, 'state', game.state)
  .hset(gameKey, 'wrong', 0)
  .hset(gameKey, 'theme', game.theme)
  await multi.execAsync()
  let guesses = await this.data.smembersAsync(`${gameKey}:guesses`)
  let image = this.canvas.drawGame(game, guesses)
  let pomf = await this.pomf.postImage(image)
  await this.data.hsetAsync(gameKey, 'image', pomf.image)
  msg.channel.createMessage(pomf.image).then(async gameMsg => {
    await this.data.hsetAsync(gameKey, 'message', gameMsg.id)
  }).catch(() => {})
}
