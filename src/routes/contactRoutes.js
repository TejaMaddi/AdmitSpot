const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

router.post('/', contactController.addContact);
router.get('/', contactController.getContacts);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);
router.post('/batch', contactController.batchProcessContacts);

module.exports = router;
