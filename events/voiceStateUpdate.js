const { pausePlaying } = require('../modules/play-music');
module.exports = {
   name: 'voiceStateUpdate',
   execute(oldState, newState) {
      const client = oldState.member.client;
      let whichState = oldState;

      if (!oldState.channelId) whichState = newState;

      if (whichState.channel.members.find(m => m.id === client.user.id)) {
         if (whichState.channelId !== newState.channelId && !newState.channelId || newState.channelId !== whichState.channelId) {
            return pausePlaying;
         }

         if (newState.member.id !== client.user.id) return pausePlaying;

      }
   },
};