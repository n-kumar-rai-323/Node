
const Joi = require("joi");

const Schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com"] },
  }).required(), // Made email required for login
  password: Joi.string().optional().required(), //made password required
});

const FPSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    })
    .required(),
  newPassword: Joi.string().required(),
  token: Joi.string().required(),
});

const validate = async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body);
    next();
  } catch (e) {
    console.log(e);
    const { details } = e;
    next(details[0]?.message);
  }
};


const forgetPasswordValidation = async (req, res, next) => {
  try {
    await FPSchema.validateAsync(req.body);
    next();
  } catch (e) {
    console.log(e);
    const { details } = e;
    next(details[0]?.message);
  }
};
module.exports = { validate, forgetPasswordValidation };