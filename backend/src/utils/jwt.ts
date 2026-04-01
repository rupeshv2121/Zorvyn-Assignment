import jwt from "jsonwebtoken";
import { env } from "../config";
import { UnauthorizedError } from "./errors";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
    }
    throw new UnauthorizedError("Token verification failed");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    throw new UnauthorizedError("Token verification failed");
  }
};
