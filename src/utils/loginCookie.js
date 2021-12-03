module.exports = (res, client) => {
  delete client.password;
  const token = jwt.sign({ client }, process.env.JWT_KEY);
  res.cookie('name', 'login').send(token);
  return token;
};
