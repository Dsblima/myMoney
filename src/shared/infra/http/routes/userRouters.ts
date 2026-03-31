import { Router } from "express";
import { CreateUserController } from "../../../../modules/users/controllers/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/controllers/DeleteUserController";
import { ListUserController } from "../../../../modules/users/controllers/ListUserController";
import { UpdateUserController } from "../../../../modules/users/controllers/UpdateUseController";

const userRouters = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updateUserController = new UpdateUserController()

userRouters.get("/", listUserController.handle);
userRouters.post("/", createUserController.handle);
userRouters.put("/:id", updateUserController.handle);
userRouters.delete("/:id", deleteUserController.handle);

export { userRouters };

