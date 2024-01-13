const express = require('express');
const path = require('path');

require("dotenv").config()

const app = express();
const port = process.env.PORT;
const distPath = '../../ui/dist'

app.use(express.static(path.join(__dirname, distPath)));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
