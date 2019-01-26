let fs = require('fs');

const FILES_SIZE_LIMIT = 1e6;

let handleFileErrors = require('../handleFileErrors');

const STATUS_CODES = require('../statusCodes');

module.exports = (filePath, req, res) => {
  let fileSize = req.headers['content-length'];
  if (fileSize && fileSize > FILES_SIZE_LIMIT) {
    errorResponse(STATUS_CODES.FILE_TOO_BIG, res);
    return;
  }

  let options = { flags: 'wx', autoClose: true };
  let writeFileStream = fs.createWriteStream(filePath, options);

  req.pipe(writeFileStream);

  req.on('data', checkDataSize);

  req.on('open', () => {
    console.log('req open');
  });

  req.on('close', () => {
    console.log('req close');

    req.removeListener('data', checkDataSize);

    writeFileStream.destroy();

    fs.unlink(filePath, err => {
      if (err) console.log(err);
    });
  });

  let writtenBytes = 0;
  function checkDataSize(data) {
    writtenBytes += data.length;
    console.log('Data: ', data.length, ' | All: ', writtenBytes);

    if (writtenBytes > FILES_SIZE_LIMIT) {
      errorResponse(STATUS_CODES.FILE_TOO_BIG, res);

      req.removeListener('data', checkDataSize);

      fs.unlink(filePath, err => {
        if (err) console.error(err);
      });
    }
  }

  writeFileStream.on('error', err => {
    handleFileErrors(err, res);
  });

  writeFileStream.on('finish', () => {
    res.statusCode = STATUS_CODES.OK;
    res.end();
  });

  writeFileStream.on('open', () => {
    console.log('WriteFile open');
  });

  writeFileStream.on('close', () => {
    console.log('WriteFile close');
  });
};
