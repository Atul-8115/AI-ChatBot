import { Router } from "express";
import { getAllUsers, userLogOut, userLogin, userSignUp, verifyUser, } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
console.log("I'm here in route");
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignUp);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogOut);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map