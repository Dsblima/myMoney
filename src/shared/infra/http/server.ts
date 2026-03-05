import express from "express";
import "reflect-metadata";
import { routes } from "./routes";

const app = express();
app.use(express.json());
app.use(routes)
app.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});
