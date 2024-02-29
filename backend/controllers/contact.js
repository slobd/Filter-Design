const Contact = require("../models/Contact");
const Tag = require("../models/Tag");

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ author: req.query.author }).populate(
    "tags"
  );
  return res.status(200).json(contacts);
};

const getContact = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.query.id }).populate("tags");
  return res.status(200).json(contact);
};

const createContact = async (req, res) => {
  const contact = new Contact({
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    position: req.body.position,
    linkedin: req.body.linkedin,
    logo: req.files.logo ? req.files.logo[0].path : null,
    company_name: req.body.company_name,
    company_logo: req.files.company_logo
      ? req.files.company_logo[0].path
      : null,
    tags: req.body.tags,
    author: req.body.author,
  });

  try {
    const dataToSave = await contact.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  const response = await Contact.deleteOne({
    _id: req.query.id,
  });
  return res.status(200).json(response);
};

const bulkImportContact = async (req, res) => {
  let contacts = [];
  let newTags = [];
  for (let contact of req.body.contacts) {
    let tags = [];
    for (let tag of contact.tags) {
      let findTag = await Tag.findOne({ name: tag });
      if (!findTag) {
        let newTag = await Tag.create({ name: tag });
        newTags.push(newTag);
        tags.push(newTag);
      } else {
        tags.push(findTag);
      }
    }

    let newContact = await Contact.create({
      ...contact,
      tags,
    });

    contacts.push({ ...newContact.toObject(), tags });
  }

  res.status(200).json({ contacts, tags: newTags });
};

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  bulkImportContact,
};
