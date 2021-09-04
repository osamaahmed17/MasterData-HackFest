const multer = require('multer')
const upload = multer({dest: 'tmp/excel/'});
module.exports = upload;