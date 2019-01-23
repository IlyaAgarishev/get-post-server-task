'use strict';

let url = require('url');
let fs = require('fs');

let FILES_FOLDER = __dirname + '/files/';
let FILES_SIZE_LIMIT = 1e6;

let STATUS_CODES = {
  OK: 200,
  NOT_SUPPORTED: 500,
  FILE_EXIST: 409,
  FILE_TOO_BIG: 413,
  FILE_NOT_FOUND: 404,
  UNSUPPORTED_PATH: 400
};

require('http')
  .createServer(function(req, res) {
    let pathname = decodeURI(url.parse(req.url).pathname);
    console.log('Method: ', req.method);
    // let fileName;
    switch (req.method) {
      case 'GET':
        if (pathname == '/') {
          sendFile(__dirname + '/public/index.html', res);
        } else {
          let fileName = permitFileName(pathname);
          console.log('[Get]: Filename:', fileName, ' pathname: ', pathname);
          if (!fileName) {
            errorResponse(STATUS_CODES.UNSUPPORTED_PATH, res);
            return;
          }

          sendFile(FILES_FOLDER + fileName, res);
          return;
        }

      default:
        break;
    }
  })
  .listen(3000);

function permitFileName(fileName) {
  let PERMITTED_FILES_REGEXP = /^\/[^/]+$/;
  let fileNameMatch = fileName.match(PERMITTED_FILES_REGEXP);
  if (!fileNameMatch) return;

  let file = fileNameMatch[0].slice(1);
  if (file === 'favicon.ico' || file === 'service-worker.js') return;
  return file;
}

function sendFile(filePath, res) {
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
}

function handleFileErrors(err, res) {
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
}

function errorResponse(code, res) {
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
}
