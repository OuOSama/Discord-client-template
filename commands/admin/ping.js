const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  cooldown: false,
  commands: new SlashCommandBuilder()
    .setName('admin-ping')
    .setDescription('Replies with Pong!'),
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

    await interaction.reply({ content: 'Secret Pong!', ephemeral: true })
  },
}
