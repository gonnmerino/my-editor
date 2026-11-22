import {createHash, randomBytes} from "node:crypto";
import jwt from "jsonwebtoken";

export const RERESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV == "production",
  sameSite: "strict",
  path: "/api/v1/auth",
};

export function generateRefreshToken() {
  return randomBytes(48).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest('hex');
}

export function signAccessToken (userId) {
  return jwt.sign({sub: userId}, process.env.JWT_SECRET, {expiresIn: "15m", algorithm: "HS256"});
}