import { Router } from "express";
import { CreateUserController } from "../../../../modules/users/controllers/CreateUserController";

const userRouters = Router();

const createUserController = new CreateUserController();

userRouters.get("/", createUserController.handle);
userRouters.post("/", createUserController.handle);

export { userRouters };

