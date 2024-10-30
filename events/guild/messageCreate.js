// guild/messageCreate.js
const { Events } = require('discord.js')

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute(message) {
    if (message.content === 'hi') {
      message.reply('hello')
    } else if (message.content === 'kuy') {
      message.reply('kuy lai')
    }
  },
}
