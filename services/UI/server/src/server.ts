import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT;
const staticFilesPath = process.env.STATIC_FILES_DIR ?? "../../ui/dist";

function init() {
    app.use(express.static(path.join(__dirname, staticFilesPath)));
    app.listen(port);
}

init();
