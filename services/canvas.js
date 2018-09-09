const path = require('path')
const { createCanvas, registerFont } = require('canvas')
const themes = require('./themes')

function font (file) {
  return path.join(__dirname, '../fonts', file)
}
registerFont(font('lato.ttf'), { family: 'Lato' })
registerFont(font('sourcecodepro.ttf'), { family: 'Source Code Pro' })

function rgb (hex) {
  hex = hex.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3')
  let rgb = hex.split(/(..)/).filter(Boolean)
  return rgb.map(e => parseInt(e, 16))
}

module.exports = {
  drawGame (game, guesses) {
    let canvas = createCanvas(200, 200)
    let ctx = canvas.getContext('2d')

    let theme = themes[game.theme || 'dark']

    // Background
    ctx.fillStyle = theme.bg
    ctx.fillRect(0, 0, 200, 200)

    // Topic Bar
    ctx.fillStyle = theme.bgLight
    ctx.fillRect(0, 0, 200, 22)

    // Guesses Area
    ctx.fillStyle = theme.bgDark
    ctx.fillRect(0, 22, 70, 105)

    // Topic
    ctx.fillStyle = theme.bold
    ctx.font = 'bold 15px Lato'
    ctx.textBaseline = 'hanging'
    ctx.textAlign = 'center'
    ctx.fillText(game.topic.toUpperCase(), 100, 1)

    // Guesses
    ctx.fillStyle = theme.muted
    ctx.font = 'bold 10px Lato'
    ctx.fillText('GUESSES', 35, 23)
    ctx.fillStyle = theme.text
    ctx.font = 'bold 12px "Source Code Pro"'
    let rows = guesses.join('').split(/(...)/).filter(Boolean)
    for (let i = 0; i < rows.length; i++)
      ctx.fillText(rows[i].padEnd(3).split('').join('  '), 35, 35 + 12*i)

    // Hook
    ctx.strokeStyle = theme.text
    ctx.lineCap = 'round'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(95, 125)
    ctx.lineTo(145, 125)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(110, 125)
    ctx.lineTo(110, 35)
    ctx.lineTo(150, 35)
    ctx.lineTo(150, 45)
    ctx.stroke()

    // Hangman
    ctx.beginPath()
    switch (game.wrong) {
      case 6:
        ctx.moveTo(150, 75)
        ctx.lineTo(135, 85)
      case 5:
        ctx.moveTo(150, 75)
        ctx.lineTo(165, 85)
      case 4:
        ctx.moveTo(150, 100)
        ctx.lineTo(140, 115)
      case 3:
        ctx.moveTo(150, 100)
        ctx.lineTo(160, 115)
      case 2:
        ctx.moveTo(150, 65)
        ctx.lineTo(150, 100)
      case 1:
        ctx.moveTo(100 + 60, 55)
        ctx.arc(100 + 50, 55, 10, 0, 2*Math.PI)
    }
    ctx.stroke()

    // Words (REFACTOR)
    ctx.fillStyle = theme.text
    ctx.font = '20px "Source Code Pro"'
    let words = game.state.toUpperCase().split(' ')
    let line = []
    let lineCount = 0
    for (let i = 0; i < words.length; i++) {
      let word = words[i]
      let size = ctx.measureText(line.concat(word).join(' '))
      if (size.width < 180) {
        line.push(word)
      } else {
        ctx.fillText(line.join(' '), 100, 135 + lineCount * 20)
        lineCount++
        line = [word]
      }
      if (i === words.length - 1)
        ctx.fillText(line.join(' '), 100, 135 + lineCount * 20)
    }

    // Game Over
    if (game.wrong >= 6) {
      ctx.fillStyle = `rgba(${rgb(theme.lose).join(',')},.75)`
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = theme.bold
      ctx.font = 'bold 60px Lato'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText('GAME', 100, 70)
      ctx.textBaseline = 'middle'
      ctx.fillText('OVER', 100, 130)
    }

    // Game Win
    if (game.state === game.word) {
      ctx.fillStyle = `rgba(${rgb(theme.win).join(',')},.75)`
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = theme.bold
      ctx.font = 'bold 60px Lato'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText('YOU', 100, 70)
      ctx.textBaseline = 'middle'
      ctx.fillText('WON', 100, 130)
    }

    return canvas.toBuffer()
  }
}
