import express, { Router } from "express";
import bodyParser from "body-parser";
//to get the port from the .env file
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/recipesRoutes.js";

dotenv.config(); // Load environment variables from .env file
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

//use routes inside the app
app.use("/", router);

//to run the server
app.listen(process.env.PORT, () => {});
