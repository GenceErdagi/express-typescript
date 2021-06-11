import mongoose, { Schema, Document } from "mongoose";
import CustomError from "../helpers/error/CustomError";
import Question from "./Question";

interface IAnswer extends Document {
  content: string;
  createdAt: Date;
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  likes: Array<mongoose.Types.ObjectId>;
}
const AnswerSchema = new Schema<IAnswer>({
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: [10, "Please provide at least 20 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  question: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
    required: true,
  },
});

AnswerSchema.pre("save", async function (next) {
  if (!this.isModified("user")) return next();
  try {
    const question = await Question.findById(this.question);

    question?.answers.push(this._id);
    await question?.save();

    next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model("Answer", AnswerSchema);
