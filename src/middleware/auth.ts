import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

//@ts-ignore
async function auth(req: Request, res: Response, next: NextFunction) {
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

    const decoded: any = jwt.verify(token, <any>process.env.JWT_PRIVATE_KEY);
    const currentUser = await User.findById(decoded._id);

    if (currentUser) {
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
      if (decoded !== req.session[currentUser._id].token) {
        return res.status(401).send({
          data: { message: 'Invalid Token' },
        });
      }
    }

    //@ts-ignore
    req['user'] = currentUser;
    next();
  } catch (error) {
    return res.status(400).send({ data: { error } });
  }
}

export default auth;
