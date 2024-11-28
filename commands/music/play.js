const { SlashCommandBuilder } = require('discord.js')
const { useMainPlayer } = require('discord-player')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube URL and join the voice channel')
    .addStringOption((options) =>
      options.setName('url').setDescription('YouTube URL').setRequired(true)
    ),
  async execute(interaction) {
    const player = useMainPlayer()
    const channel = interaction.member.voice.channel
    if (!channel)
      return interaction.reply('You are not connected to a voice channel!')

    const url = interaction.options.getString('url', true)

    // Let's defer the interaction as things can take time to process
    await interaction.deferReply()

    try {
      const { track } = await player.play(channel, url, {
        nodeOptions: {
          metadata: interaction, // We can access this metadata object using queue.metadata later on
        },
      })

      return interaction.followUp(`**${track.title}** enqueued!`)
    } catch (e) {
      // Return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`)
    }
  },
}
