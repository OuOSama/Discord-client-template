// events/client/ready.js
const color = require('cli-color')
const { Events } = require('discord.js')
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const line = client.user.username.length + 24
    console.log('\n')
    console.log(color.greenBright(`┏${'━'.repeat(line)}┓`))
    console.log(color.greenBright(`┃${' '.repeat(line)}┃`))
    console.log(
      color.greenBright(`┃  ${client.user.username} is ready${' '.repeat(13)}┃`)
    )
    console.log(color.greenBright(`┃${' '.repeat(line)}┃`))
    console.log(color.greenBright(`┗${'━'.repeat(line)}┛`))
  },
}
