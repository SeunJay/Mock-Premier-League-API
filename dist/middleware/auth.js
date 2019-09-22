'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const User_1 = require('../models/User');
//@ts-ignore
async function auth(req, res, next) {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).send({
        data: {
          message: 'You are not logged in! Please log in to get access.',
        },
      });
    }
    const decoded = jsonwebtoken_1.default.verify(
      token,
      process.env.JWT_PRIVATE_KEY,
    );
    const currentUser = await User_1.User.findById(decoded._id);
    //console.log(decoded, req.session![currentUser!._id]);
    //console.log(currentUser)
    if (currentUser && process.env.NODE_ENV !== 'test') {
      //@ts-ignore
      if (!req.session[currentUser._id]) {
        //@ts-ignore
        console.log(req.session[currentUser._id]);
        return res.status(401).send({
          data: {
            message: 'Token expired. Please login...',
          },
        });
      }
      //@ts-ignore
      if (token !== req.session[currentUser._id].token) {
        return res.status(401).send({
          data: { message: 'Invalid Token' },
        });
      }
    }
    //@ts-ignore
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(400).send({ data: { error } });
  }
}
exports.default = auth;
//# sourceMappingURL=auth.js.map
