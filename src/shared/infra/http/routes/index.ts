import { Router } from "express";
import { authRouters } from "./authRouter";
import { userRouters } from "./userRouters";

const routes = Router();

routes.use("/users",userRouters);
routes.use("/auth",authRouters);

export { routes };

