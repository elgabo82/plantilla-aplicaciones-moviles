const { syncDb, models } = require("./models");
const buildApp = require("./app");
require("dotenv").config();

async function main() {
  await syncDb(); // ✅ crea tablas si no existen
  const app = buildApp(models);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`API running on port ${port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
