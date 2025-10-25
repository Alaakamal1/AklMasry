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
