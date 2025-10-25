// src/lib/session.ts
import { getIronSession, type SessionOptions } from "iron-session";
import "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      name: string;
      role: string;
    };
  }
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters",
  cookieName: "aklmasry_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession(req: Request, res: Response) {
  return getIronSession(req, res, sessionOptions);
}
