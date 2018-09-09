const redis = require('redis')
const bluebird = require('bluebird')
const Logger = require('./Logger')

bluebird.promisifyAll(redis)

module.exports = onConnect => {
  const logger = new Logger('REDIS')
  const client = redis.createClient({
    port: process.env.REDIS_PORT
  })
  let connected = false
  client.on('connect', () => {
    logger.log('Connected on port', +process.env.REDIS_PORT)
    if (!connected) onConnect()
    connected = true
  })
  client.on('error', err => {
    logger.error(err)
  })
  return client
}
