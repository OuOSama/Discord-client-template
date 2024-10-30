// app.js
const { TOKEN } = require('./botconfig/config.json')
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: Object.values(GatewayIntentBits), // use everything
})

// use event handler
require('./handler/events')(client)

// use commands handler
require('./handler/commands')(client)

// login
client.login(TOKEN)
