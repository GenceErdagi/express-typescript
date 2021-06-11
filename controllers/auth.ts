import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "express-async-handler";
import { sendJwtToClient } from "../helpers/auth/tokenHelpers";
import {
  validateUserInput,
  comparePassword,
} from "../helpers/input/inputHelpers";
import CustomError from "../helpers/error/CustomError";
import { sendEmail } from "../helpers/libraries/sendEmail";

export const register = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password, role } = request.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendJwtToClient(user, response);
  }
);

export const getUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.json({
    success: true,
    data: {
      id: request.user.id,
      name: request.user.name,
    },
  });
};

export const login = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body;
    if (!validateUserInput(email as string, password as string)) {
      return next(new CustomError("Email or password is missing", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!comparePassword(password, user!.password)) {
      return next(new CustomError("Please check your credentials", 400));
    }
    sendJwtToClient(user, response);
  }
);

export const logout = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { NODE_ENV } = process.env;
    return response
      .status(200)
      .cookie("access_token", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: (NODE_ENV as string) === "development" ? false : true,
      })
      .json({
        success: true,
        message: "Logout Success",
      });
  }
);

export const imageUpload = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      request.user.id,
      {
        profile_image: request.savedProfileImage,
      },
      { new: true, runValidators: true }
    );
    response.status(200).json({
      success: true,
      message: "Image Upload Successfully",
      data: user,
    });
  }
);

export const forgotPassword = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const resetEmail = request.body.email;
    const user = await User.findOne({ email: resetEmail });
    if (!user) {
      return next(
        new CustomError(
          "Please check your email,could not find a user with given email",
          400
        )
      );
    }

    const resetPasswordToken = user.generateResetTokenFromUser();
    await user.save();
    const resetPasswordUrl = `http://localhost:5050/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
    <h3>Reset Your Possword</h3>
    <p> This <a href='${resetPasswordUrl}' target='_blank'> link </a> will expire in 1 hour </p>
  `;
    try {
      await sendEmail({
        from: process.env.SMTP_USER as string,
        to: resetEmail,
        subject: "Reset Your Password",
        html: emailTemplate,
      });
      return response.status(200).json({
        success: true,
        message: "Token Sent To Your Email",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return next(new CustomError("Email Could Not Be Sent", 500));
    }
  }
);

export const resetPassword = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const { resetPasswordToken } = request.query;
    const { password } = request.body;

    if (!resetPasswordToken)
      return next(new CustomError("Please provide a valid token", 400));

    let user = await User.findOne({
      resetPasswordToken: resetPasswordToken as string,
      resetPasswordExpire: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      return next(new CustomError("Invalid Token or Session Expired", 404));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return response.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  }
);
export const editDetails = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const editInformation: any = request.body;
    const user = await User.findByIdAndUpdate(request.user.id, editInformation, {
      new: true,
      runValidators: true,
    });
    return response.status(200).json({
      success: true,
      data: user
    });
  }
);
