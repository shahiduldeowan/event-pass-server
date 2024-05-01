import dotenv from "dotenv";
import { app } from "./app.js";
import { logger } from "./config/logger/winston.config.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(
    `⚙️ Server is running at port : ${port} in ${process.env.NODE_ENV} mode`
  );
});
