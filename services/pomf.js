const superagent = require('superagent')

module.exports = {
  async postImage (image) {
    try {
      if (process.env.ENV === 'dev')
        console.log('starting upload')
      let response = await superagent.post('https://pomf.cat/upload.php')
      .attach('files[]', image, 'hangman.png')
      if (process.env.ENV === 'dev')
        console.log('upload complete')
      return {
        image: `https://a.pomf.cat/${response.body.files[0].url}`
      }
    } catch (err) {
      throw err && err.response && err.response.body
    }
  }
}
