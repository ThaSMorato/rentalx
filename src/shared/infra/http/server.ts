import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import swaggerUI from "swagger-ui-express";

import "../typeorm";
import "../../container";

import swaggerFile from "../../../swagger.json";
import { AppError } from "../../errors/AppError";
import { router } from "./routes";

const PORT = 3333;

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ message: err.message });
    }

    return response.status(500).json({
      status: err,
      message: `Internal server error - ${err.message}`,
    });
  }
);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));