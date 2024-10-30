// handler/commands.js
const fs = require('node:fs')
const path = require('node:path')
const { TOKEN, CLIENT_ID, GUILD_ID } = require('../botconfig/config.json') // Make sure you have these in your config
const { Collection, Events, REST, Routes } = require('discord.js')

module.exports = (client) => {
  client.commands = new Collection()
  const foldersPath = path.join(__dirname, '../commands')
  const commandFolders = fs.readdirSync(foldersPath)

  const commands = []
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    if (fs.statSync(commandsPath).isDirectory()) {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ('commands' in command && 'execute' in command) {
          client.commands.set(command.commands.name, command)
          commands.push(command.commands)
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "commands" or "execute" property.`
          )
        }
      }
    } else if (folder.endsWith('.js')) {
      const filePath = commandsPath
      const command = require(filePath)
      if ('commands' in command && 'execute' in command) {
        client.commands.set(command.commands.name, command)
        commands.push(command.commands)
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "commands" or "execute" property.`
        )
      }
    }
  }

  const rest = new REST().setToken(TOKEN)

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

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
