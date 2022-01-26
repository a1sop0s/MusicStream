const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayer, AudioPlayerState } = require('@discordjs/voice');
const { stopPlaying } = require('../modules/play-music');
const { deleteMix } = require('../modules/download-mix');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stops playback.'),

      async execute(interaction) {
         if (AudioPlayer.state !== AudioPlayerIdleState) stopPlaying();
         setTimeout(() => { deleteMix(); }, 3000);

         await interaction.reply({ content: "Stopped playback." });
      }
};