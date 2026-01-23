import { Router } from "express";
import { userRouters } from "./userRouters";

const routes = Router();

routes.use("/users",userRouters)

export { routes };

