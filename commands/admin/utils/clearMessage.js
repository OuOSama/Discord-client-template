const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  cooldown: false,
  commands: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete Message from channel'),
  async execute(interaction) {
    // check role
    const isAdmin = interaction.member.roles.cache.some(
      (role) => role.name === 'Admin'
    )
    const isOwner = interaction.user.id === interaction.guild.ownerId

    if (!(isAdmin || isOwner)) {
      return interaction.reply({
        content: 'You do not have permission to use this command TwT',
        ephemeral: true,
      })
    }

    // Fetch messages
    const messages = await interaction.channel.messages.fetch({ limit: 100 })
    const messagesToDelete = messages.filter(
      (msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
    )

    if (messagesToDelete.size === 0) {
      return interaction.reply({
        content: 'No messages found that can be deleted (under 14 days old).',
        ephemeral: true,
      })
    }

    // Bulk delete messages
    await interaction.channel.bulkDelete(messagesToDelete)

    const reply = await interaction.reply('Messages have been cleared!')

    setTimeout(() => {
      reply.delete()
    }, 3000)
  },
}
