import { createSchema, Type, typedModel } from 'ts-mongoose';
import jwt from 'jsonwebtoken';

const userSchema = createSchema({
  name: Type.string(),
  email: Type.string(),
  password: Type.string(),
  isAdmin: Type.optionalBoolean(),
  ...({} as {
    getToken: () => string;
  }),
});

userSchema.methods.getToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    <any>process.env.JWT_PRIVATE_KEY,
    { expiresIn: 360000 },
  );
  return token;
};

export const User = typedModel('User', userSchema);
