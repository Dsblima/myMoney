import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/auth/controllers/AuthenticateUserController";

const authRouters = Router();

const authenticateUserController = new AuthenticateUserController();

authRouters.post("/session", authenticateUserController.handle);

export { authRouters };
