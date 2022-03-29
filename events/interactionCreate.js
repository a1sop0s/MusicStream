const { startPlaying, stopPlaying } = require('../modules/play-music');
const { handlePagination } = require('../modules/handle-pagination');

module.exports = {
   name: 'interactionCreate',
   async execute(interaction) {
      const client = interaction.client;
      if (!interaction.isCommand() && !interaction.isSelectMenu() && !interaction.isMessageComponent()) return;

      switch (interaction.customId) {
         case 'podcastselect':
            await stopPlaying();
            await interaction.update( { content: "Loading...", components: []});

            await startPlaying(interaction.member.voice.channel, interaction.values[0]);
            await interaction.deleteReply();
            await interaction.channel.send({ content: "Playing!" });
            break
         case 'podcastnext':
            const page = handlePagination();
            await interaction.update({ content: `Please select a mix or podcast: (Page ${page[0]+1}/${page[1]})`, components: [page[2][0], page[2][1]] });
            break
         case 'podcastback':
            const pageBack = handlePagination('back');
            await interaction.update({ content: `Please select a mix or podcast: (Page ${pageBack[0]+1}/${pageBack[1]})`, components: [pageBack[2][0], pageBack[2][1]] });
            break
      }

      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
         await command.execute(interaction);
      } catch (error) {
         console.error(error);
         await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
   }
}