'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const validateUser_1 = require('../validators/validateUser');
const bcrypt_1 = __importDefault(require('bcrypt'));
const User_1 = require('../models/User');
//@ts-ignore
exports.signup = async (req, res) => {
  const { error } = validateUser_1.validateUser(req.body);
  if (error)
    return res
      .status(401)
      .send({ error: error.details[0].message.replace(/\"/g, '') });
  try {
    const { email, name } = req.body;
    let user = await User_1.User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
    user = await new User_1.User(req.body);
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hash(user.password, salt);
    const message = { name, email };
    const token = user.getToken();
    const newUser = await user.save();
    //@ts-ignore
    req.session[newUser._id] = { token, message };
    return res.status(200).json({ success: true, data: token, user: newUser });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      data: message,
    });
  }
};
//# sourceMappingURL=signup.js.map
