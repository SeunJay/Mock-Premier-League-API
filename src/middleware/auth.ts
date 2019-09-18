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

    if (!currentUser) {
      return res.status(401).send({
        data: {
          message: 'The user belonging to this token does no longer exist.',
        },
      });
    }

    //@ts-ignore
    req['user'] = currentUser;
    next();
  } catch (error) {
    return res.status(400).send({ data: { error } });
  }
}

export default auth;
