import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./Config/databaseConfig.js";
import router from "./Router/router.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectDatabase();

app.use(cors({
   origin: `${process.env.FRONTEND_URL}`,
   credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(process.env.PORT, console.log(`Server started at port number ${process.env.PORT}`));