const themes = require('../themes')

module.exports = async function selectTheme (msg, args) {
  let theme = args[0] && args[0].toLowerCase()
  if (theme) {
    if (theme in themes) {
      await this.data.hsetAsync('themes', msg.author.id, theme)
      this.reply(msg, `selected theme: \`${theme}\``)
    } else {
      this.reply(msg, 'that theme doesn\'t exist, try again!')
    }
  } else {
    let themeNames = Object.keys(themes)
    let current = await this.getTheme(msg)
    msg.channel.createMessage([
      `Current theme: \`${current}\``,
      `Select one of the following themes: ${themeNames.join(', ')}`
    ].join('\n'))
    await this.openMenu(msg, 'selectTheme')
  }
}
