import ExcelJS from "exceljs";
import fse from "fs-extra";
import { resolve } from "path";
import { logger } from "../config/logger/winston.config.js";
import { ApiError, ApiJsonError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const textFilePath = resolve(
  `${process.env.TEXT_FILE_PATH || "03-05-2024-event.txt"}`
);
const excelFilePath = resolve(
  `${process.env.EXCEL_FILE_PATH || "03-05-2024-event.xlsx"}`
);

const generateAndAppendExcelFile = async (currentDate, message) => {
  try {
    if (fse.existsSync(excelFilePath)) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(excelFilePath);
      const worksheet = workbook.getWorksheet(1);
      worksheet.addRow([currentDate, message]);
      await workbook.xlsx.writeFile(excelFilePath);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    worksheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Name", key: "name", width: 20 },
    ];
    worksheet.addRow({ date: currentDate, name: message });
    await workbook.xlsx.writeFile(excelFilePath);
  } catch (error) {
    logger.error(error.message);
  }
};

const verifyInvitation = (req, res) => {
  try {
    const body = req.body;
    if (!body?.message) {
      logger.error("Data required!");
      res.status(400).json(new ApiJsonError(400, "Data required!"));
      return;
    }
    logger.info(`${body?.message}`);
    res
      .status(200)
      .json(new ApiResponse(200, body, "Invitation verified successfully"));
  } catch (error) {
    logger.error(error.message || "Invitation failed");
    throw new ApiError(
      error.status || 500,
      error.message || "Internal Server Error"
    );
  }
};

const watchInvitation = async (req, res) => {
  try {
    const body = req.body;
    if (!body?.message) {
      logger.error("Data required!");
      res.status(400).json(new ApiJsonError(400, "Data required!"));
      return;
    }

    const currentDate = new Date().toLocaleString();
    const message = body?.message;

    const appendText = `${currentDate} - ${message}`;
    fse.appendFileSync(textFilePath, appendText + "\n");
    await generateAndAppendExcelFile(currentDate, message);
    logger.info(`${body?.message}`);
    res
      .status(200)
      .json(new ApiResponse(200, body, "Invitation watched successfully"));
  } catch (error) {
    logger.error(error.message || "Invitation watched failed");
    throw new ApiError(
      error.status || 500,
      error.message || "Internal Server Error"
    );
  }
};

export { verifyInvitation, watchInvitation };
