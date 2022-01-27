module.exports = {
   name: 'interactionCreate',
   async execute(interaction) {
      const client = interaction.client;
      if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

      if (interaction.customId === 'podcastselect') {
         await interaction.update( { content: "Downloading...", components: []});
         await downloadMix(interaction.values[0]);
         await startPlaying(interaction.member.voice.channel);
         await interaction.deleteReply();
         await interaction.channel.send({ content: "Playing." });
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