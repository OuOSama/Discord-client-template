const { Client, GatewayIntentBits, Options } = require('discord.js')
const { TOKEN } = require('./botconfig/config.json')
const { Player } = require('discord-player')
const { YoutubeiExtractor } = require('discord-player-youtubei')

const client = new Client({
  makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  sweepers: Options.DefaultSweeperSettings,
  intents: Object.values(GatewayIntentBits),
})

const player = new Player(client)
player.extractors.register(YoutubeiExtractor, {})

require('./handlers/events')(client)
require('./handlers/commands')(client)
require('./handlers/music')(player)

client.login(TOKEN)
