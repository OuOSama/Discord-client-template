const { SlashCommandBuilder } = require('discord.js')
const { useQueue, QueueRepeatMode } = require('discord-player')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('loop')
    .setDescription("Toggle the looping of song's or the whole queue")
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('What action you want to perform on the loop')
        .setRequired(true)
        .addChoices(
          { name: 'Queue', value: 'enable_loop_queue' },
          { name: 'Disable', value: 'disable_loop' },
          { name: 'Song', value: 'enable_loop_song' },
          { name: 'Autoplay', value: 'enable_autoplay' }
        )
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild)
    const action = interaction.options.getString('action')
    if (!queue?.isPlaying()) {
      return interaction.reply({
        content: `No music currently playing, <${interaction.member}>... try again? <❌>`,
      })
    }

    switch (action) {
      case 'enable_loop_queue':
        if (queue.repeatMode === QueueRepeatMode.QUEUE) {
          return interaction.reply({
            content: `The queue is already set to loop, <${interaction.member}>! 🎶🔁`,
          })
        }
        queue.setRepeatMode(QueueRepeatMode.QUEUE)
        return interaction.reply('Queue loop is now enabled! 🔄')

      case 'disable_loop':
        if (queue.repeatMode === QueueRepeatMode.OFF) {
          return interaction.reply({
            content: `Loop is already disabled, <${interaction.member}>! ❌`,
          })
        }
        queue.setRepeatMode(QueueRepeatMode.OFF)
        return interaction.reply('Loop has been disabled! ❌')

      case 'enable_loop_song':
        if (queue.repeatMode === QueueRepeatMode.TRACK) {
          return interaction.reply({
            content: `The song is already in loop mode, <${interaction.member}>! 🎶🔁`,
          })
        }
        queue.setRepeatMode(QueueRepeatMode.TRACK)
        return interaction.reply('The current song is now looping! 🔁')

      case 'enable_autoplay':
        if (queue.autoplay) {
          return interaction.reply({
            content: `Autoplay is already enabled, <${interaction.member}>! 🎶▶️`,
          })
        }
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
        return interaction.reply('Autoplay is now enabled! ▶️')

      default:
        return interaction.reply(
          'Invalid action! Please choose a valid option.'
        )
    }
  },
}
