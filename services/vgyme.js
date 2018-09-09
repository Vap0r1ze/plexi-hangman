const superagent = require('superagent')

module.exports = {
  async postImage (image) {
    if (process.env.ENV === 'dev')
      console.log('starting upload')
    let response = await superagent.post('https://vgy.me/upload')
    .attach('file', image, 'hangman.png')
    if (process.env.ENV === 'dev')
      console.log('upload complete')
    return response.body
  }
}
