const util = require('util');
const path = require('path');
const Storage = require('@google-cloud/storage');


function cloudify(err, options = {}, cb = function(){}) {
  return new Promise((res, rej) => {
    if (err) {
      rej(err);
      return cb(err, null);
    }

    const { key, projectId, bucketName, filenamePrefix, img } = options;
    const storage = Storage({ credentials: key, projectId });
    const  bucket = storage.bucket(bucketName);

    const data = Buffer.from(img.replace(/^data:image\/(png|jpeg);base64,/, ""), "base64");
    const mimetype = img.match(/image\/(png|jpeg)/)[0];
    const ext = mimetype.match(/png|jpeg/)[0];
    const filename = `${filenamePrefix || 'img'}-${Date.now()}.${ext}`;
    const upload = bucket.file(filename);
    const blobStream = upload.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    });
    blobStream.on('error', err => {
      rej(err);
      return cb(err, null);
    });

    blobStream.on('finish', () => {
      bucket.file(filename).makePublic()
        .then(() => {
          const url = util.format(`https://storage.googleapis.com/${bucket.name}/${upload.name}`);
          res(url);
          return cb(null, url);
        })
        .catch(err => {
          rej(err);
          return cb(err, null);
        });
    });

    blobStream.end(data);
  });
}

module.exports = cloudify;