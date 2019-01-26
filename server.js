'use strict';

const url = require('url');

const FILES_FOLDER = __dirname + '/files/';

const STATUS_CODES = require('./modules/statusCodes');

let writeFile = require('./modules/writeFile');
let removeFile = require('./modules/removeFile');
let sendFile = require('./modules/sendFile');
let errorResponse = require('./modules/errorResponse');
let permitFileName = require('./modules/permitFileName');

let server = (req, res) => {
  let pathname = decodeURI(url.parse(req.url).pathname);
  let fileName;
  switch (req.method) {
    case 'GET':
      if (pathname == '/') {
        sendFile(__dirname + '/index.html', res);
        return;
      } else {
        fileName = permitFileName(pathname);

        if (!fileName) {
          errorResponse(STATUS_CODES.UNSUPPORTED_PATH, res);
          return;
        }

        sendFile(FILES_FOLDER + fileName, res);
        return;
      }
    case 'POST':
      fileName = permitFileName(pathname);
      if (!fileName) {
        errorResponse(STATUS_CODES.UNSUPPORTED_PATH, res);
        return;
      }

      writeFile(FILES_FOLDER + fileName, req, res);
      return;
    case 'DELETE':
      fileName = permitFileName(pathname);
      if (!fileName) {
        errorResponse(STATUS_CODES.UNSUPPORTED_PATH, res);
        return;
      }
      removeFile(FILES_FOLDER + fileName, res);
      return;

    default:
      res.statusCode = 502;
      res.end('Not implemented');
  }
};

require('http')
  .createServer(server)
  .listen(3000);
