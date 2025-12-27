const express = require("express");

module.exports = (models) => {
  const router = express.Router();

  // GET /api/v1/books
  router.get("/", async (req, res) => {
    const rows = await models.Book.findAll({ order: [["id", "DESC"]] });
    res.json(rows);
  });

  // GET /api/v1/books/:id
  router.get("/:id", async (req, res) => {
    const row = await models.Book.findByPk(Number(req.params.id));
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  // POST /api/v1/books
  router.post("/", async (req, res) => {
    const { title, author, year, isbn } = req.body || {};
    if (!title || !author) return res.status(400).json({ message: "title and author required" });

    const created = await models.Book.create({
      title,
      author,
      year: year ? Number(year) : null,
      isbn: isbn || null
    });

    res.status(201).json(created);
  });

  // PUT /api/v1/books/:id
  router.put("/:id", async (req, res) => {
    const row = await models.Book.findByPk(Number(req.params.id));
    if (!row) return res.status(404).json({ message: "Not found" });

    const payload = { ...req.body };
    if (payload.year !== undefined && payload.year !== null && payload.year !== "") {
      payload.year = Number(payload.year);
    }
    if (payload.year === "") payload.year = null;

    await row.update(payload);
    res.json(row);
  });

  // DELETE /api/v1/books/:id
  router.delete("/:id", async (req, res) => {
    const row = await models.Book.findByPk(Number(req.params.id));
    if (!row) return res.status(404).json({ message: "Not found" });
    await row.destroy();
    res.status(204).send();
  });

  return router;
};
