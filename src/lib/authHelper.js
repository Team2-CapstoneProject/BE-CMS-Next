import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const secretKey = process.env.SECRET_KEY;
const nSalt = process.env.N_SALT;

const tokenSign = (obj) => {
  return jwt.sign(obj, secretKey);
};

const verifyToken = (bearerHeader) => {
  let token = bearerHeader.split(' ')[1]
  return jwt.verify(token, secretKey);
};

const passwordHash = async (password) => {
  return await bcrypt.hash(String(password), Number(nSalt));
};

const verifyPassword = async (enteredPassword, password) => {
  return await bcrypt.compare(enteredPassword, password)
};

export { tokenSign, verifyToken, passwordHash, verifyPassword };