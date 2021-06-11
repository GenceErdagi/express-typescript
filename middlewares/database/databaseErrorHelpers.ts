import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import Question from "../../models/Question";
import CustomError from "../../helpers/error/CustomError";
import asyncHandler from "express-async-handler";
import Answer from "../../models/Answer";

export const checkUserExist = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const {id}  = request.params;
    const user = await User.findById(id);
    if (!user)
      return next(new CustomError("There is no such user with that id", 400));
    request.data = user;
    next();
  }
);

export const checkQuestionExist = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const question_id = request.params.id || request.params.question_id;
    const question = await Question.findById(question_id);
    if (!question)
      return next(
        new CustomError("There is no such question with that id", 400)
      );
    request.data = question;
    next();
  }
);

export const checkAnswerExist = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const answer_id =  request.params.answer_id;
    const question_id = request.params.question_id
    const answer = await Answer.findOne({
      _id:answer_id,
      question:question_id
    });
    if (!answer)
      return next(
        new CustomError("There is no such answer with that id associated with question id", 400)
      );

    next();
  }
);