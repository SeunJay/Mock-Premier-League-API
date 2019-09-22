import { Request, Response, NextFunction } from 'express';

//@ts-ignore
function admin(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  if (!req['user'].isAdmin) {
    return res.status(403).send({
      data: { message: 'You do not have permission to perform this action' },
    });
  }
  next();
}

export default admin;
