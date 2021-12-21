import { Router } from "express";

import { CreateRentalController } from "../../../../modules/rentals/useCases/createRental/CreateRentalController";
import { DevolutuionRetalController } from "../../../../modules/rentals/useCases/devolutuionRetal/DevolutuionRetalController";
import { ListRentalsByUserController } from "../../../../modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutuionRetalController = new DevolutuionRetalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalRoutes.post("/", ensureAuthenticated, createRentalController.handle);
rentalRoutes.get(
  "/user",
  ensureAuthenticated,
  listRentalsByUserController.handle
);
rentalRoutes.patch(
  "/devolution/:id",
  ensureAuthenticated,
  devolutuionRetalController.handle
);

export { rentalRoutes };
