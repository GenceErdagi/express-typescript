import { Request, Response } from "express";

export const sendJwtToClient = (user: any, response: Response) => {
  const token = user.generateJwtFromUser();
  const { JWT_COOKIE, NODE_ENV } = process.env;
  return response
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      
      expires: new Date(Date.now() + parseInt(JWT_COOKIE as string) * 1000 * 60),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      access_token: token,
      data: {
        name: user.name,
        email: user.email,
      },
    });
};

export const isTokenIncluded = (request: Request) => {
  return (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer:")
  );
};

export const getAccessTokenFromHeader = (request: Request) => {
  const authorization = request.headers.authorization;
  const access_token = authorization?.split(" ")[1] as string;
  return access_token;
};
