const express = require('express');
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadContacts);
router.get('/download', fileController.downloadContacts);

module.exports = router;
