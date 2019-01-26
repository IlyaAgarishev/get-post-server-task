const fs = require('fs');

module.exports = (filePath, res) => {
  let options = { flags: 'r', autoClose: true };
  let readFileStream = fs.createReadStream(filePath, options);

  readFileStream.pipe(res);

  readFileStream.on('error', err => {
    handleFileErrors(err, res);
  });

  res.on('close', () => {
    console.log('res on SendFile close');
    readFileStream.destroy();
  });

  readFileStream.on('open', () => {
    console.log('readFileStream open');
  });

  readFileStream.on('close', () => {
    console.log('readFileStream close');
  });
};
