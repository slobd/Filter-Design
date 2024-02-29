const upload = async (req, res) => {
  res.status(200).json({ path: req.file.path });
};

module.exports = { upload };
