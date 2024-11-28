const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('song-info')
    .setDescription('See what song is currently playing'),
  async execute(interaction) {
    await interaction.deferReply()
    const queue = useQueue(interaction.guild)

    if (!queue?.isPlaying()) {
      return interaction.editReply({
        content: `No music currently playing... try again? ❌`,
      })
    }

    const track = queue.currentTrack
    const methods = ['disabled', 'track', 'queue']
    const trackDuration =
      track.duration === 'Infinity' ? 'infinity (live)' : track.duration
    const progress = queue.node.createProgressBar()

    const embed = new EmbedBuilder()
      .setAuthor({
        name: track.title,
        iconURL: interaction.client.user.displayAvatarURL({
          size: 1024,
          dynamic: true,
        }),
      })
      .setThumbnail(track.thumbnail)
      .setDescription(
        `
        Volume: **${queue.node.volume}%**\n
        Duration: **${trackDuration}**\n
        Progress: ${progress}\n
        Loop mode: **${methods[queue.repeatMode]}**\n
        `
      )

    await interaction.editReply({
      embeds: [embed],
    })
  },
}
