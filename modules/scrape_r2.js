const axios = require('axios').default;
const cheerio = require('cheerio');
const shows = require('../podcasts.json');


async function retrieveStreams(show) {
   const _show = shows.podcasts.find(s => s.name === show);

   // If for some reason the show cannot be found, return
   if (!_show) return;

   // Array to be filled with paginated streams
   let showInfo = [];

   // Retrieve and load the selected show's XML page
   const response = await axios(_show);
   const $ = cheerio.load(response.data, {
      xmlMode: true
   });

   // Define items as all the elements that are named "item"
   const items = $('item');
   const arr = items.toArray();

   // Pagination variables
   let itemCount = 0;
   let pageElements = [];

   // Iterate through the shows and paginate
   for (let i = 0; i < arr.length; i++) {

      // Place all the page contents into an array
      const item = $(arr[i]);
      // Locate the title, enclosure URL and publishing date of the podcast
      const _title = item.find('title').text();
      const _url = item.find('enclosure').attr('url');
      const _date = item.find('pubDate').text().substring(0, 16);

      // Ignore if for some reason a podcast is missing any of the required fields
      if (!_title || !_date || !_url) return console.log(_title, _date, _url);

      // Construct object with the fields above
      const infoObj = new Object();
      infoObj.label = _title;
      infoObj.description = _date;
      infoObj.value = _url;

      // Push infoObj into pageElements array and increase current itemCount
      pageElements.push(infoObj);
      itemCount++;

      if (itemCount >= 25 || itemCount >= arr.length) {
         // Reset itemCount, pageElements and push pageElements into showInfo array
         itemCount = 0;
         showInfo.push(pageElements);
         pageElements = [];
      }
   }
   console.log(showInfo[0], showInfo[0].length);
   return showInfo;

}
exports.retrieveStreams = retrieveStreams;
