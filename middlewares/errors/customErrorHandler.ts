import { NextFunction, Response, Request } from "express";
import CustomError from "../../helpers/error/CustomError";

const customErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let customError = error;
 
  if (error.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax", 400);
  }
  if (error.name === "ValidationError") {
    customError = new CustomError(error.message, 400);
  }
  if (error.code === 11000) {
    customError = new CustomError("Duplicate Key Found : Check Your Inputs", 400);
  }
  if (error.name === "CastError") {
    customError = new CustomError("Please provide a valid id", 400);
  }
  console.log(error);
  response.status(customError.status || 500).json({
    success: false,
    message: customError.message || "Internal Server Error",
  });
};

export default customErrorHandler;
