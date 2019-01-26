let fs = require('fs');

let handleFileErrors = require('../handleFileErrors');

const STATUS_CODES = require('../statusCodes');

module.exports = (fileName, res) => {
  fs.unlink(fileName, err => {
    if (err) {
      handleFileErrors(err, res);
      return;
    }

    res.statusCode = STATUS_CODES.OK;
    res.end('Delete');
  });
};
