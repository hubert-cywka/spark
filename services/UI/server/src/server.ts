import { Response } from "express";
import { responseHeaders } from "../../common/config/responseHeaders";

const express = require('express');
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT;
const staticFilesPath = '../../ui/dist';

function setResponseHeaders(response: Response) {
    response.set(responseHeaders)
}

function init() {
    app.use(express.static(path.join(__dirname, staticFilesPath), {
        setHeaders: setResponseHeaders
    }));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

init();

