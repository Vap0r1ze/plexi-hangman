const guessLetter = require('./guessLetter')
const startGame = require('./startGame')
const quitGame = require('./quitGame')
const showGame = require('./showGame')
const showWord = require('./showWord')
const guessWord = require('./guessWord')
const selectTheme = require('./selectTheme')

const prefix = process.env.PREFIX
const helpMessage = [
  '__Hangman__',
  `**Start a game** \`${prefix}start\``,
  `**Quit a game** \`${prefix}quit\``,
  `**Open theme menu** \`${prefix}theme [theme]\``,
  `**Repost the game display** \`${prefix}show\``,
  `**Guess the word** \`${prefix}guess <word>\``,
  `\n**To guess a letter, use** \`${prefix}\` **followed by that letter**`
    + ` (e.g. \`${prefix}a\` \`${prefix}g\` \`${prefix}f\`)`
].join('\n')

module.exports = async function hangman (msg, args) {
  let command = args.shift()
  if (!command) return
  switch (command.toLowerCase()) {
    case 'ping':
      msg.channel.createMessage('Pong!')
    break
    case 'help':
      msg.channel.createMessage(helpMessage)
    break
    case 'start':
      await startGame.bind(this)(msg)
    break
    case 'quit':
      await quitGame.bind(this)(msg)
    break
    case 'show':
      await showGame.bind(this)(msg)
    break
    case 'word':
      if (process.env.ENV === 'dev')
        await showWord.bind(this)(msg)
    break
    case 'guess':
      await guessWord.bind(this)(msg, args.join(' ').toLowerCase())
    break
    case 'theme':
      await selectTheme.bind(this)(msg, args)
    default:
      if (!/^[a-z]$/i.test(command)) break
      await guessLetter.bind(this)(msg, command.toLowerCase())
  }
}
