const { SlashCommandBuilder } = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the song'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild)

    if (!queue || queue.node.isPlaying()) {
      return interaction.reply(
        'There are no songs that have been stopped to continue playing.'
      )
    }

    queue.node.resume()
    await interaction.reply('The song has resumed playing.')
  },
}
