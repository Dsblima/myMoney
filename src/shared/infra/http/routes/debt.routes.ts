import { Router } from 'express';
import { CreateDebtController } from '../../../../modules/debts/controllers/CreateDebtController';

const debtRoutes = Router();

const createDebtController = new CreateDebtController();

debtRoutes.post("/", createDebtController.handle);

export { debtRoutes };

