'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const joi_1 = __importDefault(require('joi'));
exports.validateTeam = data => {
  const schema = {
    name: joi_1.default
      .string()
      .min(3)
      .max(225)
      .required(),
    email: joi_1.default
      .string()
      .email()
      .required(),
    coach: joi_1.default
      .string()
      .min(3)
      .max(225)
      .required(),
    country: joi_1.default
      .string()
      .min(3)
      .max(225)
      .required(),
    founded: joi_1.default.number().required(),
    stadium_name: joi_1.default
      .string()
      .min(3)
      .max(255)
      .required(),
    stadium_capacity: joi_1.default
      .string()
      .min(3)
      .max(255)
      .required(),
    wins: joi_1.default.number(),
    losses: joi_1.default.number(),
    goals: joi_1.default.number(),
  };
  return joi_1.default.validate(data, schema);
};
//# sourceMappingURL=validateTeam.js.map
