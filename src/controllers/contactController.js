const Contact = require('../models/Contact');

// Add Contact
exports.addContact = async (req, res) => {
    const { name, email, phone, address, timezone } = req.body;
    const contact = new Contact({ name, email, phone, address, timezone });

    try {
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Contacts
exports.getContacts = async (req, res) => {
    const { filter = {}, sort = 'createdAt' } = req.query;

    try {
        const contacts = await Contact.find({ deletedAt: null })
            .find(filter)
            .sort(sort);
        res.json(contacts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Contact
exports.updateContact = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });
        res.json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Contact (Soft Delete)
exports.deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        await Contact.findByIdAndUpdate(id, { deletedAt: new Date() });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Batch Add/Update Contacts
exports.batchProcessContacts = async (req, res) => {
    const contacts = req.body;

    try {
        const result = await Contact.insertMany(contacts);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
