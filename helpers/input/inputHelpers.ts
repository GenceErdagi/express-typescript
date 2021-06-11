import bcrypt from "bcryptjs";
export const validateUserInput = (email: string, password: string) => {
  return email && password;
};
export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
