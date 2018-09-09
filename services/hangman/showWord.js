module.exports = async function showWord (msg) {
  let gameKey = `hangman:${msg.channel.id}:${msg.author.id}`
  let word = await this.data.hgetAsync(gameKey, 'word')
  if (!word)
    return this.reply(msg, 'you\'re not in a game!')
  this.reply(msg, `your word is \`${word}\``)
}
