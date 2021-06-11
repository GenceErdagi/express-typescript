import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../helpers/error/CustomError";
import User from "../../models/User";
import Question from "../../models/Question";
import {
  isTokenIncluded,
  getAccessTokenFromHeader,
} from "../../helpers/auth/tokenHelpers";
import asyncHandler from "express-async-handler";
import Answer from "../../models/Answer";

export const getAccessToRoute = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(request)) {
    return next(
      new CustomError("You are not authorized to access this route", 401)
    );
  }
  const accessToken = getAccessTokenFromHeader(request);
  jwt.verify(
    accessToken,
    JWT_SECRET_KEY as string,
    (error: any, decoded: any) => {
      if (error) {
        return next(
          new CustomError("You are not authorized to access this route ", 401)
        );
      }
      request.user = {
        id: decoded.id,
        name: decoded.name,
      };
      next();
    }
  );
};

export const getAdminAccess = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const id = request.user.id;
    const user = await User.findById(id);

    if (user?.role !== "admin") {
      return next(
        new CustomError("You are not authorized to do access admin routes", 403)
      );
    }

    next();
  }
);

export const getQuestionOwnerAccess = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const userId = request.user.id;
    const questionId = request.params.id;

    const question = await Question.findById(questionId);
    if (!question) return next(new CustomError("Internal database error", 500));
    if (question.user != userId){
      return next(new CustomError("You are not authorized to access this question", 403));
    } 
    
    next();
  }
);

export const getAnswerOwnerAccess = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const userId = request.user.id;
    const answerId = request.params.answer_id;

    const answer = await Answer.findById(answerId);
    if (!answer) return next(new CustomError("Internal database error", 500));
    if (answer.user != userId){
      return next(new CustomError("You are not authorized to access this question", 403));
    } 
    
    next();
  }
);
