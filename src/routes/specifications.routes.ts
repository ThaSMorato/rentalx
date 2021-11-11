import { Router } from "express";

import { createSpecificationController } from "../modules/cars/useCases/createSpecification";

const specificationsRoutes = Router();

specificationsRoutes.post("/", createSpecificationController.handle);

export { specificationsRoutes };
