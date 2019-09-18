import { validateUser } from '../validators/validateUser';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/User';

//@ts-ignore
export const signup = async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(401)
      .send({ error: error.details[0].message.replace(/\"/g, '') });

  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });

    user = await new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.getToken();
    const newUser = await user.save();
    return res.status(200).json({ success: true, data: token, user: newUser });
  } catch (error) {
    const { message } = error;
    return res.status(400).send({
      data: message,
    });
  }
};
