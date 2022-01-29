const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, NoSubscriberBehavior} = require('@discordjs/voice');
const { deleteMix } = require('./download-mix');
const player = createAudioPlayer({
   behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
   },
});

async function startPlaying(channel) {
   const resource = createAudioResource("./mixes_temp/mix.mp3");

   player.play(resource);

   try {
      await entersState(player, AudioPlayerStatus.Playing, 5_000);
      // The player has entered the Playing state within 5 seconds
      const connection = joinVoiceChannel({
         channelId: channel.id,
         guildId: channel.guild.id,
         adapterCreator: channel.guild.voiceAdapterCreator,
      });
      if (!connection) return console.error('fuck');
      connection.subscribe(player);

      console.log('Playback has started!');
   } catch (error) {
      // The player has not entered the Playing state and either:
      // 1) The 'error' event has been emitted and should be handled
      // 2) 5 seconds have passed
      return console.error(error);
   }
}

async function stopPlaying() {
   if (player.state.status !== 'idle') {
      await player.stop();
      deleteMix();
   }
}

function pausePlaying() {
   if (player.state.status !== 'paused' && player.state.status !== 'playing') return null;

   if (player.state.status !== 'paused') {
      player.pause();
      return 'paused'
   } else {
      player.unpause();
      return 'playing';
   }
}


exports.startPlaying = startPlaying;
exports.stopPlaying = stopPlaying;
exports.pausePlaying = pausePlaying;