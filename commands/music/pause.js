const { SlashCommandBuilder } = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the song'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild)

    if (!queue || !queue.isPlaying()) {
      return interaction.reply('There are no songs currently playing.')
    }

    queue.node.pause()
    await interaction.reply('The music has been paused.')
  },
}
