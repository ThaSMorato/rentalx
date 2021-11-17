import { Router } from "express";
import multer from "multer";

import { CreateCategory } from "../modules/cars/useCases/createCategory";
import { importCategory } from "../modules/cars/useCases/importCategory";
import { listCategories } from "../modules/cars/useCases/listCategories";

const categoriesRoutes = Router();

const upload = multer({
  dest: "./tmp",
});

categoriesRoutes.post("/", (request, response) => {
  CreateCategory().handle(request, response);
});

categoriesRoutes.get("/", (request, response) => {
  listCategories().handle(request, response);
});

categoriesRoutes.post("/import", upload.single("file"), (request, response) => {
  importCategory().handle(request, response);
});

export { categoriesRoutes };
