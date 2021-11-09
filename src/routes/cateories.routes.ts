import { Router, Request, Response } from "express";

import { CategoryRepository } from "../repositories/CategoriesRepository";

const categoriesRoutes = Router();
const categoriesRepository = new CategoryRepository();

categoriesRoutes.post("/", (request: Request, response: Response) => {
  const { name, description } = request.body;

  const categoryAlreadyExists = categoriesRepository.findByName(name);

  if (categoryAlreadyExists) {
    return response.status(400).json({ error: "Category already exists" });
  }

  categoriesRepository.create({ name, description });

  return response.status(201).send();
});

categoriesRoutes.get("/", (request: Request, response: Response) => {
  const categories = categoriesRepository.list();

  return response.json(categories);
});

export { categoriesRoutes };
