const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  commands: new SlashCommandBuilder()
    .setName('setup-role')
    .setDescription('Create basic roles in this server'),
  async execute(interaction) {
    // check role
    const isOwner = interaction.user.id === interaction.guild.ownerId
    if (!isOwner) {
      return interaction.reply({
        content: 'Only Owner can use this command TwT',
        ephemeral: true,
      })
    }

    try {
      const rolesToCreate = ['Admin', 'Member', 'verify']
      let createdRoles = []

      const roleColors = {
        Admin: '#010101',
        Member: '#006400',
        verify: '#90EE90',
      }

      // Check if each role exists, if not, create them
      for (const roleName of rolesToCreate) {
        const roleExists = interaction.guild.roles.cache.some(
          (role) => role.name === roleName
        )

        if (!roleExists) {
          const role = await interaction.guild.roles.create({
            name: roleName,
            color: roleColors[roleName],
          })
          createdRoles.push(roleName)
          console.log(`Created new role: ${role.name}`)
        }
      }

      if (createdRoles.length === 0) {
        await interaction.reply({
          content: 'All roles already exist!',
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: `The following roles have been created successfully: ${createdRoles.join(
            ', '
          )}`,
          ephemeral: true,
        })
      }
    } catch (error) {
      console.error('Error creating roles:', error)
      await interaction.reply({
        content:
          'There was an error while creating the roles. Please try again later.',
        ephemeral: true,
      })
    }
  },
}
