import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
async function main() {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();
