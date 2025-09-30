// lib/session.ts
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

export const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters",
  cookieName: "aklmasry_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // فقط HTTPS في production
  },
};

export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: any) {
  return withIronSessionSsr(handler, sessionOptions);
}
