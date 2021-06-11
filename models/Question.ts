import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";
interface IQuestion extends Document {
  title: string;
  content: string;
  slug: string;
  createdAt: Date;
  user: mongoose.Types.ObjectId;
  makeSlug: Function;
  likes: Array<mongoose.Types.ObjectId>;
  answers: Array<mongoose.Types.ObjectId>;
}
const QuestionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    minlength: [10, "Please provide at least 10 characters"],
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: [10, "Please provide at least 20 characters"],
  },
  slug: String,
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
  answers: [{
    type: mongoose.Types.ObjectId,
    ref: "Answer",
  }],
});

QuestionSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
  }
  this.slug = this.makeSlug();
  next();
});

QuestionSchema.methods.makeSlug = function () {
  return slugify(this.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });
};
export default mongoose.model<IQuestion>("Question", QuestionSchema);
