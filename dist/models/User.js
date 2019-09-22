'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const ts_mongoose_1 = require('ts-mongoose');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const userSchema = ts_mongoose_1.createSchema(
  Object.assign(
    {
      name: ts_mongoose_1.Type.string(),
      email: ts_mongoose_1.Type.string(),
      password: ts_mongoose_1.Type.string(),
      isAdmin: ts_mongoose_1.Type.optionalBoolean(),
    },
    {},
  ),
);
userSchema.methods.getToken = function() {
  const token = jsonwebtoken_1.default.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '2hr' },
  );
  return token;
};
exports.User = ts_mongoose_1.typedModel('User', userSchema);
//# sourceMappingURL=User.js.map
