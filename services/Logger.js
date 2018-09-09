const chalk = require('chalk')

class Logger {
  constructor (title) {
    this.title = title
    this.chalk = chalk
  }

  _log (titleColor, ...items) {
    let itemsColored = items.map(item => {
      if (item == null)
        return chalk.grey(item)
      switch (item.constructor) {
        case Number:
          return chalk.greenBright(item)
        case Boolean:
          return chalk.magentaBright(item)
        case RegExp:
          return chalk.yellow(item)
      }
      return item
    })
    console.log(titleColor.white(` ${this.title} `), ...itemsColored)
  }

  log (...text) {
    this._log(chalk.bgGreen, ...text)
  }
  error (err) {
    this._log(chalk.bgRed, (err && err.stack) || err)
  }
}

module.exports = Logger
