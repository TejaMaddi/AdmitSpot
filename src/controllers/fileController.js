const Contact = require('../models/Contact');
const multer = require('multer');
const multerXlsx = require('xlsx');
const fs = require('fs');

// File Upload Configuration
const upload = multer({ storage: multer.memoryStorage() });

// Handle File Uploads
exports.uploadContacts = (req, res) => {
    const fileType = req.file.mimetype;

    if (fileType === 'text/csv') {
        // Handle CSV file
        fs.writeFileSync('./uploads/contacts.csv', req.file.buffer);
        // Implement CSV parsing logic
        // Save parsed contacts to DB
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Handle Excel file
        fs.writeFileSync('./uploads/contacts.xlsx', req.file.buffer);
        // Implement Excel parsing logic
        // Save parsed contacts to DB
    }

    res.status(200).json({ message: 'File uploaded successfully.' });
};

// Download Contacts as CSV
exports.downloadContacts = async (req, res) => {
    const contacts = await Contact.find();
    const csvData = contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        timezone: contact.timezone,
        createdAt: contact.createdAt,
    }));

    // Generate CSV and send as response
    res.header('Content-Type', 'text/csv');
    res.attachment('contacts.csv');
    // Convert csvData to CSV format and send...
};
