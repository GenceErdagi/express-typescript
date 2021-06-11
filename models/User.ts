import mongoose, { Schema, Document } from "mongoose";
import Question from "./Question"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  website?: string;
  title?: string;
  place?: string;
  profile_image: string;
  blocked: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  generateResetTokenFromUser: Function;
  generateJwtFromUser: Function;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please provide a valid email",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    minlength: [6, "Please proivde minimum 6 length password"],
    required: [true, "Please proivde a password"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile_image: {
    type: String,
    default: "default.jpeg",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  title: String,
  about: String,
  website: String,
  place: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});
UserSchema.post("remove", async function remove() {
  await Question.deleteMany({
    user : this._id
  });
});

UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY as string, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

UserSchema.methods.generateResetTokenFromUser = function (): string {
  const randomHexString: string = crypto.randomBytes(15).toString("hex");
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = new Date(
    Date.now() + parseInt(RESET_PASSWORD_EXPIRE as string)
  );
  return resetPasswordToken;
};

export default mongoose.model<IUser>("User", UserSchema);
