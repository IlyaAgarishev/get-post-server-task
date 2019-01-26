const STATUS_CODES = require('../statusCodes');

module.exports = (code, res) => {
  let errorMessage;

  switch (code) {
    case STATUS_CODES.UNSUPPORTED_PATH:
      errorMessage = 'Path to file is not supported';
      break;
    case STATUS_CODES.FILE_EXIST:
      errorMessage = 'File already exits';
      break;
    case STATUS_CODES.FILE_TOO_BIG:
      errorMessage = 'File was too big(gt 1mb)';
      break;
  }

  res.statusCode = code;
  res.end(errorMessage);
};
