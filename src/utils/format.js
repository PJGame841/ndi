module.exports = (res, code, data) => {
  const valid = code >= 200 && code < 400;
  if (!valid) data = { message: data };
  return res.status(code).send(JSON.stringify({ valid, data }));
};
