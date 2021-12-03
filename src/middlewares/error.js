module.exports = (req, res, next) => {
  try {
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};
