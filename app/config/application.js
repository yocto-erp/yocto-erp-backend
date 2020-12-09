export default {
  hostname: '0.0.0.0',
  port: 3000,
  fileUploadDir: './uploads/',
  emailFileUploadDir: './public/uploads/',
  logFile: {
    folder: 'logs',
    errorFile: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    handleExceptions: true,
    maxSize: '10m',
    maxFiles: '2d'
  },
  JWT: {
    secret: 'TWOR!#$IERFLD'
  }
};
