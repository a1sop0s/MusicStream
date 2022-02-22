const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { retrieveStreams } = require('../modules/scrape_r2.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Lists available mixes and plays upon selection.')
      .addStringOption(option =>
         option.setName('show')
            .setDescription('The show to select a mix or podcast from.')
            .setRequired(true)
            .addChoice('Citylights FM', 'Citylights FM')
            .addChoice('Grindtape', 'Grindtape')
            .addChoice('Programm', 'Programm')
            .addChoice('Tjuun In', 'Tjuun In')
            .addChoice('Urbanism', 'Urbanism')
         ),


      async execute(interaction) {
         const selectedShow = await interaction.options.getString('show');

         const streams = await retrieveStreams(selectedShow);
         if (!streams) return interaction.reply({ content: "Something went wrong!", ephemeral: true });
         const row = new MessageActionRow()
            .addComponents(
               new MessageSelectMenu()
               .setCustomId('podcastselect')
               .setPlaceholder('Nothing selected')
               .addOptions(streams[0])
            );

         await interaction.reply({ content: "Please select a mix or podcast:", components: [row], ephemeral: true });
      }
};