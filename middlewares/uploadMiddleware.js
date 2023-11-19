const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage to handle files as buffers
const upload = multer({ storage: storage });

module.exports = upload;
