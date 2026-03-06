import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 2 * 1000 * 60 * 60 * 24,
  path: "/",
};
