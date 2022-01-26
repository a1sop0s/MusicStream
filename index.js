const fs = require('fs');
const dotenv = require('dotenv');
const { downloadMix } = require('./modules/download-mix');
const { startPlaying } = require('./modules/play-music');
const { Client, Collection, Intents } = require('discord.js');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Read commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);

   client.commands.set(command.data.name, command);
}


// Read events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
   const event = require(`./events/${file}`);
   if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
   } else {
      client.on(event.name, (...args) => event.execute(...args));
   }
}



client.on('interactionCreate', async interaction => {
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
});

client.login(process.env.D_TOKEN);