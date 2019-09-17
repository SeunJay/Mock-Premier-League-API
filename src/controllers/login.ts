import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/User';

//@ts-ignore
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send({ data: { message: 'Invalid Credentials!' } });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .send({ data: { message: 'Invalid Credentials!' } });

    const token = user.getToken();
    res.status(200).send({
      data: token,
    });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      data: message,
    });
  }
};
