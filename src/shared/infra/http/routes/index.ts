import { Router } from "express";
import { authRouters } from "./authRouter";
import { debtRoutes } from "./debt.routes";
import { userRouters } from "./userRouters";

const routes = Router();

routes.use("/users",userRouters);
routes.use("/auth",authRouters);
routes.use("/debts",debtRoutes);

export { routes };

