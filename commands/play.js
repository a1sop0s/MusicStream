const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, CommandInteractionOptionResolver } = require('discord.js');
const { retrieveStreams, retrieveShowlist } = require('../modules/scrape_r2.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Lists available Mixes and plays upon selection.')
      .addStringOption(option =>
         option.setName('show')
            .setDescription('The show to select a mix or podcast from.')
            .setRequired(true)
            .addChoice('Tjuun In', 'Tjuun In')
            .addChoice('Grindtape', 'Grindtape')
         ),


      async execute(interaction) {
         const optionResolver = new CommandInteractionOptionResolver();
         const selectedShow = optionResolver.get('show').value;
         const streams = await retrieveStreams(selectedShow);

         const row = new MessageActionRow()
            .addComponents(
               new MessageSelectMenu()
               .setCustomId('podcastselect')
               .setPlaceholder('Nothing selected')
               .addOptions(streams)
            );

         await interaction.reply({ content: "Please select a mix or podcast:", components: [row] });
      }
};