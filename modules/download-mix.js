const fs = require('fs');
const axios = require("axios").default;


async function downloadMix(url) {
   console.log(url);
   const res = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });
   //console.log(url);
   const streamToFile = (inputStream, filePath) => {
      //console.log(inputStream);
      return new Promise((resolve, reject) => {
         const fileWriteStream = fs.createWriteStream(filePath)
         inputStream
            .pipe(fileWriteStream)
            .on('finish', resolve)
            .on('error', reject)
         });
      }

   const path = "./mixes_temp/mix.mp3";
   await streamToFile(res.data, path);
}

function deleteMix() {
   fs.unlinkSync('./mixes_temp/mix.mp3');
}

exports.downloadMix = downloadMix;
exports.deleteMix = deleteMix;