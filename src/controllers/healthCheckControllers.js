import { logger } from "../config/logger/winston.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = async (req, res) => {
  try {
    logger.info("Health check successful");
    res
      .status(200)
      .json(new ApiResponse(200, "OK", "Server is up and running"));
  } catch (error) {
    logger.error(`Health check failed! ${error.message}`);
    throw new ApiError(500, "Health check failed !");
  }
};

export { healthCheck };
