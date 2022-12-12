const express = require("express");
const cors = require("cors");
const routes = require("./controllers")
// const connectionToDb = require("./database")
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000

const startNodeJsServer = () => {
    try {
        app.use(cors({ origin: "*" }))
        app.use(bodyParser.json());
        app.use(express.urlencoded({ extended: true }))
        app.use(routes());
        app.listen(port, () => console.log(`server started on port ${port}`));
    }
    catch (err) {
        console.log("error in starting server", err)
    }
}

startNodeJsServer();