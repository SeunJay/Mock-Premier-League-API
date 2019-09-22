import Joi from 'joi';

export const validateTeam = (data: object) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(225)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    coach: Joi.string()
      .min(3)
      .max(225)
      .required(),
    country: Joi.string()
      .min(3)
      .max(225)
      .required(),
    founded: Joi.number().required(),
    stadium_name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    stadium_capacity: Joi.string()
      .min(3)
      .max(255)
      .required(),
    wins: Joi.number(),
    losses: Joi.number(),
    goals: Joi.number(),
  };
  return Joi.validate(data, schema);
};
