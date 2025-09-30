// // app/api/auth/route.ts
// import { withSessionRoute } from "@/lib/session";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// // POST = login
// async function loginRoute(req: any, res: any) {
//   await connectDB();
//   const { email, password } = await req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ error: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

//   req.session.user = { id: user._id, email: user.email, role: user.role };
//   await req.session.save();

//   return res.json({ message: "Login successful", user: req.session.user });
// }

// // GET = fetch current logged-in user
// async function getUserRoute(req: any, res: any) {
//   const user = req.session.user;
//   if (!user) return res.status(401).json({ error: "Not logged in" });

//   return res.json({ user });
// }

// // DELETE = logout
// async function logoutRoute(req: any, res: any) {
//   req.session.destroy();
//   return res.json({ message: "Logged out successfully" });
// }

// export default withSessionRoute(async (req: any, res: any) => {
//   switch (req.method) {
//     case "POST":
//       return loginRoute(req, res);
//     case "GET":
//       return getUserRoute(req, res);
//     case "DELETE":
//       return logoutRoute(req, res);
//     default:
//       res.setHeader("Allow", ["POST", "GET", "DELETE"]);
//       return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// });

"user server";
import {signIn , signOut} from "@/auth";
export const login = async () =>{
  await signIn("github",{redirectTo:"/"});
};
export const logout = async () => {
  await signOut ({redirectTo:"/"})
}
