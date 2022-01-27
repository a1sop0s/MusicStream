const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { stopPlaying } = require('../modules/play-music');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stops playback.'),

      async execute(interaction) {
         stopPlaying();
         const connection = getVoiceConnection(interaction.guildId);
         if (connection) connection.destroy();

         await interaction.reply({ content: "Stopped playback!" });
      }
};