const { pausePlaying } = require('../modules/play-music');
module.exports = {
   name: 'voiceStateUpdate',
   execute(oldState, newState) {
      const client = oldState.member.client;
      let whichState = oldState;
      // which state to use depending on whether oldState exists or not, default is oldState

      if (!oldState.channelId) whichState = newState; // assign newState as whichState if oldState channelId is null

      if (whichState.channel.members.find(m => m.id === client.user.id)) {
         // If client is in the voice channel that fired voiceStateUpdate
         if (whichState.channelId !== newState.channelId && !newState.channelId || newState.channelId !== whichState.channelId) {
            // If the user whose state changed left the channel

            if (whichState.channel.members.size <= 1) return pausePlaying;
            // Pause playing if that was the last member to leave
         }

         if (newState.member.id !== client.user.id) return pausePlaying;

      }
   },
};