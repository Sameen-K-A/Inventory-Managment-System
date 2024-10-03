import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./Config/databaseConfig.js";
import router from "./Router/router.js";

dotenv.config();
const app = express();
connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(process.env.PORT, console.log(`Server started at port number ${process.env.PORT}`));