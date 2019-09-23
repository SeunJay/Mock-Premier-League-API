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
        .json({ success: false, message: 'Invalid Credentials!' });
    const isMatch = await bcrypt.compare(password, user.password);
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
