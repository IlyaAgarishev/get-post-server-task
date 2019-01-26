module.exports = fileName => {
  let PERMITTED_FILES_REGEXP = /^\/[^/]+$/;
  let fileNameMatch = fileName.match(PERMITTED_FILES_REGEXP);
  if (!fileNameMatch) return;

  let file = fileNameMatch[0].slice(1);
  if (file === 'favicon.ico' || file === 'service-worker.js') return;
  return file;
};
