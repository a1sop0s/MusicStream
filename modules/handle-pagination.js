const {
   MessageActionRow,
   MessageSelectMenu,
   Message,
   MessageButton
} = require('discord.js');

let currentPage = 0;
let streams;

// Build action rows to be sent as components in messages
function createRows(streams, disableButtons) {
   const row = new MessageActionRow()
      .addComponents(
         new MessageSelectMenu()
            .setCustomId('podcastselect')
            .setPlaceholder('Nothing selected')
            .addOptions(streams),
      );

   const buttonrow = new MessageActionRow()
      .addComponents(
         new MessageButton()
            .setCustomId('podcastback')
            .setEmoji('945771799692599316')
            .setStyle('PRIMARY')
            .setDisabled(disableButtons),
         new MessageButton()
            .setCustomId('podcastnext')
            .setEmoji('945771799789060096')
            .setStyle('PRIMARY')
            .setDisabled(disableButtons)
      )
   return [row, buttonrow]
}

// Set the stream variable to the streams of the show and reset paging
function setStream(_streams) {
   currentPage = 0;
   streams = _streams;

   // Create rows and disable buttons, if there is only 1 page of streams
   const streamPage = createRows(streams[0], streams.length === 1);
   return streamPage;
}

function handlePagination(dir) {
   dir === 'back' ? currentPage-- : currentPage++;

   // Circle back to the beginning of the array, page 1
   if (currentPage === streams.length) currentPage = 0
   // Circle back to the end of the array
   if (currentPage === -1) currentPage = streams.length - 1;

   // Create rows and ensure buttons are enabled
   const streamPage = createRows(streams[currentPage], false);

   return [ currentPage, streams.length, streamPage ]
}
exports.handlePagination = handlePagination;
exports.setStream = setStream;
