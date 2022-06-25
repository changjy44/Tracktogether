const express = require("express");
const router = express.Router();

const accountRouter = require("./account.route");
const groupRouter = require("./group.route");
router.use("/account", accountRouter);
router.use("/group", groupRouter);

module.exports = router;
