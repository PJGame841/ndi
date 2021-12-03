module.exports = (app) => {
  app.use('/client', require('./client'));
  app.use('/auth', require('./auth'));
};
