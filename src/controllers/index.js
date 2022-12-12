const express = require("express");
const tokens = require("./tokens");
const router = express.Router();


module.exports = () => {
    router.use("/api", tokens());
    return router;
}