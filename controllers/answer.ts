import { NextFunction, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import CustomError from "../helpers/error/CustomError";
import Answer from "../models/Answer";
import Question from "../models/Question";

export const addNewAnswerToQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { question_id } = request.params;
    const user_id = request.user.id;
    const { content } = request.body;
    const answer = await Answer.create({
      content,
      question: question_id,
      user: user_id,
    });
    return response.status(200).json({
      success: true,
      data: answer,
    });
  }
);

export const getAllAnswersFoQuestion = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { question_id } = request.params;
    const question = await Question.findById(question_id);
    const answers = question?.answers;
    return response.status(200).json({
      success: true,
      count: answers?.length,
      data: answers,
    });
  }
);

export const getSingleAnswer = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const answer_id = request.params.answer_id;
    const answer = await Answer.findById(answer_id)
      .populate({ path: "question", select: "title" })
      .populate({ path: "user", select: "name profile_image" });
    console.log(answer);
    return response.status(200).json({
      success: true,
      data: answer,
    });
  }
);

export const updateSingleAnswer = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const answer_id = request.params.answer_id;
    const { title } = request.body;
    const answer = await Answer.findByIdAndUpdate(answer_id, { title });
    return response.status(200).json({
      success: true,
      data: answer,
    });
  }
);
