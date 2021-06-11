import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "express-async-handler";
import CustomError from "../helpers/error/CustomError";

export const blockUser = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;

    const user = await User.findById(id);
    if (!user)
      return next(new CustomError("Internal Error : could not find user", 500));

    user.blocked = !user.blocked;
    await user.save();
    return response.status(200).json({
      success: true,
      message: "Block - Unblock success",
    });
  }
);

export const deleteUser = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const user = await User.findById( id );
    await user?.remove();
    return response.status(200).json({
      success:true,
      message:"User deleted successfully"
    })
  }
);
