const themes = require('./themes')

module.exports = {
  async selectTheme (msg) {
    let themeName = msg.content.toLowerCase()
    if (themeName in themes) {
      await this.closeMenu(msg)
      await this.data.hsetAsync('themes', msg.author.id, themeName)
      this.reply(msg, `selected theme: \`${themeName}\``)
    } else {
      this.reply(msg, 'that theme doesn\'t exist, try again!')
    }
  }
}
