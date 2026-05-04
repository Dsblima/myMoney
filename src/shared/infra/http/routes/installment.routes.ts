import { Router } from "express";
import { PayInstallmentController } from "../../../../modules/installments/controllers/PayInstallmentController";

const installmentRoutes = Router();

const payInstallmentController = new PayInstallmentController();

installmentRoutes.patch("/:installmentId/pay", payInstallmentController.handle);

export { installmentRoutes };
