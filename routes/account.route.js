const multer = require("multer");
const express = require("express");
const router = express.Router();
const accountController = require("../controller/account.controller.js");
const auth = require("../controller/auth");
const { account } = require("../models/index.js");
const { get } = require("./group.route.js");
const { upload } = require("../helpers/filehelper");
const db = require("../models");
const Account = db.account;

router.post(
  "/",
  // AccountValidator.createAccount,
  // ErrorValidator.ifErrors,
  accountController.createAccount
);

router.put(
  "/",
  auth,
  // AccountValidator.updateAccount,
  // ErrorValidator.ifErrors,
  accountController.updateAccount
);

router.get("/refresh", auth, accountController.refresh);

router.post(
  "/login",
  // AccountValidator.login,
  // ErrorValidator.ifErrors,
  accountController.login
);

router.get("/quote", auth, accountController.fetchQuote);

router.put("/upload", auth, upload, accountController.uploadImage);

router.delete("/remove", auth, accountController.removeImage);

router.get("/transactions", auth, accountController.retrieveTransactions);

router.put(
  "/transactions",
  // AccountValidator.login,
  // ErrorValidator.ifErrors,
  auth,
  accountController.addTransactions
);

router.get("/alerts", auth, accountController.getAlerts);

router.put("/alerts", auth, accountController.clearAlerts);

router.get("/adjustment", auth, accountController.getAdjustments);

module.exports = router;
