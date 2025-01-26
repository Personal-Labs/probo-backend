import app from "./app";
import dotenv from "dotenv";
import { PORT } from "./config/env.config";
dotenv.config();

async function main() {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();
