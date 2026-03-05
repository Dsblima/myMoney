import { Router } from "express";
import { CreateUserController } from "../../../../modules/users/controllers/CreateUserController";
import { ListUserController } from "../../../../modules/users/controllers/ListUserController";

const userRouters = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

userRouters.get("/", listUserController.handle);
userRouters.post("/", createUserController.handle);

export { userRouters };

