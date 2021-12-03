const Joi = require('joi');
const { format } = require('../utils');

const serverSchema = Joi.object({
  clientId: Joi.string().length(18).required(),
  largeImageKey: Joi.string().empty('').allow(null, ''),
  largeImageText: Joi.string().empty('').allow(null, ''),
  smallImageKey: Joi.string().empty('').allow(null, ''),
  smallImageText: Joi.string().empty('').allow(null, ''),
  buttons: Joi.array()
    .items({
      label: Joi.string().required(),
      url: Joi.string().required(),
    })
    .empty('')
    .allow(null, '')
    .default([]),
});

const check = async (req, res, next) => {
  try {
    let { data } = req.body;
    data = JSON.parse(data);
    data.buttons = JSON.parse(data.buttons);
    await serverSchema.validateAsync(data);
    next();
  } catch (e) {
    console.log('not good');
    return format(res, 400, 'Post data not good ! ' + e);
  }
};

module.exports = check;
