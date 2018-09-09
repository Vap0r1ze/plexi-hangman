module.exports = {
  reply (msg, ...lines) {
    msg.channel.createMessage(`**${msg.author.username}**, ${lines.join('\n')}`)
  },
  sample (array) {
    return array[Math.floor(Math.random() * array.length)]
  },
  indicesOf (str, char) {
    let indices = []
    for (let i = 0; i < str.length; i++)
      if (str[i] === char) indices.push(i)
    return indices
  },
  async openMenu (msg, menu, timeout = 60000) {
    await this.data.setAsync(`menu:${msg.channel.id}:${msg.author.id}`, menu)
    setTimeout(async () => {
      let deleted = await this.closeMenu(msg)
      if (deleted)
        this.reply(msg, 'menu closed because you took too long')
    }, timeout)
    return
  },
  async closeMenu (msg) {
    return await this.data.delAsync(`menu:${msg.channel.id}:${msg.author.id}`)
  },
  async getTheme (msg) {
    return await this.data.hgetAsync('themes', msg.author.id) || 'dark'
  }
}
