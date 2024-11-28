const fs = require('node:fs')
const path = require('node:path')
const {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  DEFAULT_COOLDOWN,
} = require('../botconfig/config.json')
const { Collection, Events, REST, Routes } = require('discord.js')

module.exports = (client) => {
  client.commands = new Collection()
  client.cooldowns = new Collection()

  const foldersPath = path.join(__dirname, '../commands')
  const commands = []
  const getCommandFiles = (folderPath) => {
    const folderContent = fs.readdirSync(folderPath)

    for (const item of folderContent) {
      const itemPath = path.join(folderPath, item)

      if (fs.statSync(itemPath).isDirectory()) {
        getCommandFiles(itemPath)
      } else if (item.endsWith('.js')) {
        const command = require(itemPath)
        if ('commands' in command && 'execute' in command) {
          client.commands.set(command.commands.name, command)
          commands.push(command.commands)
        } else {
          console.log(
            `[WARNING] The command at ${itemPath} is missing a required "commands" or "execute" property.`
          )
        }
      }
    }
  }

  getCommandFiles(foldersPath)

  // Commands
  const rest = new REST().setToken(TOKEN)

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    // cooldown
    const { cooldowns } = interaction.client
    if (!cooldowns.has(command.commands.name)) {
      cooldowns.set(command.commands.name, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.commands.name)
    const cooldownAmount = (command.cooldown ?? DEFAULT_COOLDOWN) * 1_000

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1_000
        return interaction.reply({
          content: `Please wait ${timeLeft.toFixed(
            1
          )} more second before reusing the \`${
            command.commands.name
          }\` command.`,
          ephemeral: true,
        })
      }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        })
      }
    }
  })
  ;(async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      )
      const data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      )
      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      )
    } catch (error) {
      console.error(error)
    }
  })()
}
