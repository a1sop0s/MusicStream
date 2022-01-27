const fs = require('fs');
const axios = require("axios").default;


async function downloadMix(url) {
   const res = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

   const streamToFile = (inputStream, filePath) => {;
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
   fs.unlink('./mixes_temp/mix.mp3', (err) => {
      if (err && err.code !== 'ENOENT' && err.code !== 'EBUSY') throw err;
   });
}

exports.downloadMix = downloadMix;
exports.deleteMix = deleteMix;