import Joi from 'joi';

export const validateUser = (data: object) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(225)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  };
  return Joi.validate(data, schema);
};
