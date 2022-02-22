const { startPlaying, stopPlaying } = require('../modules/play-music');

module.exports = {
   name: 'interactionCreate',
   async execute(interaction) {
      const client = interaction.client;
      if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

      switch (interaction.customId) {
         case 'podcastselect':
            await stopPlaying();
            await interaction.update( { content: "Downloading...", components: []});

            await startPlaying(interaction.member.voice.channel, interaction.values[0]);
            await interaction.deleteReply();
            await interaction.channel.send({ content: "Playing!" });
            break
         case 'podcast_next':
            // Update selectmenu with new value components
            break
      }
      if (interaction.customId === 'podcastselect') {
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