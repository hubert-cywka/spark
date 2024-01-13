import dotenv from "dotenv";
import express, { Response } from "express";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT;
const staticFilesPath = process.env.STATIC_FILES_DIR ?? "../../ui/dist";

function setResponseHeaders(response: Response) {
    response.set({
        "Content-Security-Policy": "default-src: self",
        "Referrer-Policy": "no-referrer",
    });
}

function init() {
    app.use(
        express.static(path.join(__dirname, staticFilesPath), {
            setHeaders: setResponseHeaders,
        })
    );

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

init();
