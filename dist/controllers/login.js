'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bcrypt_1 = __importDefault(require('bcrypt'));
const User_1 = require('../models/User');
//@ts-ignore
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // req.session!.email = password;
    const user = await User_1.User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials!' });
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials!' });
    const token = user.getToken();
    //@ts-ignore
    req.session[user._id] = {
      token,
    };
    return res.status(200).send({
      success: true,
      data: token,
    });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      data: message,
    });
  }
};
//# sourceMappingURL=login.js.map
