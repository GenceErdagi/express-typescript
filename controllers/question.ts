import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Question from "../models/Question";
import asyncHandler from "express-async-handler";
import CustomError from "../helpers/error/CustomError";

export const askNewQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const information = request.body;

    const question = await Question.create({
      ...information,
      user: request.user.id,
    });

    response.status(200).json({
      success: true,
      data: question,
    });
  }
);
export const getAllQuestions = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const questions = await Question.find();

    return response.status(200).json({
      success: true,
      data: questions,
    });
  }
);
export const getSingleQuestion = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  return response.status(200).json({
    success: true,
    data: request.data,
  });
};
export const editQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const questionId = request.params.id;
    const information = request.body;
    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        ...information,
      },
      { new: true, runValidators: true }
    );
    await question?.save();
    return response.status(200).json({
      success: true,
      data: question,
    });
  }
);
export const deleteQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const questionId = request.params.id;
    await Question.findByIdAndDelete(questionId);
    return response.status(200).json({
      success: true,
      message: "Question Delete Successfull",
    });
  }
);
export const likeQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const questionId = request.params.id;
    const userId = request.user.id;

    const question = await Question.findById(questionId);
    if (question?.likes.includes(userId)) {
      return next(new CustomError("You already liked this question",400))
    }
    question?.likes.push(userId);
    await question?.save();
    return response.status(200).json({
      success: true,
      message: "Question liked successfully",
    });
  }
);
export const undoLikeQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const questionId = request.params.id;
    const userId = request.user.id;
    const question = await Question.findById(questionId);
    if(!question)
      return next(new CustomError("Internal service error",500));
    if (!question.likes.includes(userId)) {
      return next(new CustomError("You have not liked this question yet",400))
    }
    question.likes.splice(question.likes.indexOf(userId),1);
    await question.save();
    return response.status(200).json({
      success: true,
      message: "Question unliked successfully",
    });
  }
);
