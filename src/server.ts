import express from "express";

import { categoriesRoutes } from "./routes/cateories.routes";

const PORT = 3333;

const app = express();

app.use(express.json());

app.use("/categories", categoriesRoutes);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
