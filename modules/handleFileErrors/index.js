let STATUS_CODES = require('../statusCodes');

module.exports = (err, res) => {
  let statusCode;
  let errorMessage;

  switch (err.code) {
    case 'ENOENT':
      statusCode = STATUS_CODES.FILE_NOT_FOUND;
      errorMessage = err.message;
      break;
    case 'EEXIST':
      statusCode = STATUS_CODES.FILE_EXIST;
      errorMessage = err.message;

    default:
      statusCode = STATUS_CODES.NOT_SUPPORTED;
      errorMessage = err.message;
  }

  console.error(err);

  res.statusCode = statusCode;
  res.end(errorMessage);
};
