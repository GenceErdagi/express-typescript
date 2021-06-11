import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "express-async-handler";
import CustomError from "../helpers/error/CustomError";

export const getSingleUser = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    return response.status(200).json({
      success: true,
      data: request.user,
    });
  }
);
export const getAllUsers = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const users = await User.find();

    return response.status(200).json({
      success: true,
      data: users,
    });
  }
);
