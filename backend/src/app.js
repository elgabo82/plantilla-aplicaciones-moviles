const express = require("express");
const cors = require("cors");
require("dotenv").config();

module.exports = (models) => {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
  app.use(express.json());

  app.get("/api/v1/health", (req, res) => res.json({ ok: true }));

  const v1 = express.Router();
  v1.use("/books", require("./routes/v1/books.routes")(models));
  app.use("/api/v1", v1);

  app.use((req, res) => res.status(404).json({ message: "No encontrado" }));
  return app;
};
