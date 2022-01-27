const { SlashCommandBuilder } = require('@discordjs/builders');
const { pausePlaying } = require('../modules/play-music');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('pause')
      .setDescription('Pauses or resumes playback.'),

      async execute(interaction) {
            const status = pausePlaying();
            if (status === 'paused') await interaction.reply('Paused playback!');
            if (status === 'playing') await interaction.reply('Resuming playback!');
            if (!status) await interaction.reply({ content: 'Failed to resume or pause playback, please try stopping playback instead.', ephemeral: true })
         }
};