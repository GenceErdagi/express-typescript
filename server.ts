import express from "express";
import dotenv from "dotenv";
import routers from "./router/index";
import customErrorHandler from "./middlewares/errors/customErrorHandler";
import connectDatabase from "./helpers/database/connectDatabase";
import path from "path"
dotenv.config({
  path: "./config/env/config.env",
});
//MongoDB Connection
connectDatabase();

const app = express();

const PORT = process.env.PORT;

//Express Body Middleware
app.use(express.json());

//#region Routers

app.use("/api", routers);

//#endregion
//#region ErrorHandler

app.use(customErrorHandler);

//#endregion

//#region Static Files

app.use(express.static(path.join(__dirname,"public")));

//#endregion
app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${PORT} :: ${process.env.NODE_ENV}`
  );
});
