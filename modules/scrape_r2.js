const axios = require('axios').default;
const cheerio = require('cheerio');
const shows = require('../podcasts.json');


async function retrieveStreams(show) {
   const _show = shows.podcasts.find(s => s.name === show);
   if (!_show) return;
   let showInfo = [];

   const response = await axios(_show);
   const $ = cheerio.load(response.data, {
      xmlMode: true
   });

   const items = $('item');

   const arr = items.toArray();
   for (let i = 0; i < 25; i++) {
      const item = $(arr[i]);
      const _title = item.find('title').text();
      const _url = item.find('enclosure').attr('url');
      const _date = item.find('pubDate').text().substring(0, 16);

      if (!_title || !_date || !_url) return;

      const infoObj = new Object();
      infoObj.label = _title;
      infoObj.description = _date;
      infoObj.value = _url;

      showInfo.push(infoObj);
   }
   //console.log(showInfo);
   return showInfo;

}

// Returns the shows in a template that is ready to be fed into MessageSelectMenu
async function retrieveShowlist(ignoreDesc) {
   const returnShows = [];

   if (ignoreDesc) {
      shows.forEach(s => {
         const minObj = new Object();
         minObj.name = s.name;
         minObj.value = s.name;

         returnShows.push(minObj);
      });
   } else {
      shows.forEach(s => {
         const showObj = new Object();
         showObj.label = s.name;
        // showObj.description = s.desc;
         showObj.value = s.name;

         returnShows.push(showObj);
      });
   }
   return returnShows;
}
exports.retrieveStreams = retrieveStreams;
exports.retrieveShowlist = retrieveShowlist;
//retrieveShowlist(true).then(sl => console.log(sl));
//retrieveStreams("Tjuun In")
