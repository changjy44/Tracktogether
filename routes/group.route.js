const express = require("express");
const router = express.Router();
const groupController = require("../controller/group.controller.js");
const auth = require("../controller/auth");
const { upload } = require("../helpers/filehelper");

router.post(
  "/",
  auth,
  // AccountValidator.createAccount,
  // ErrorValidator.ifErrors,
  groupController.createGroup
);

router.put(
  "/",
  auth,
  // AccountValidator.updateAccount,
  // ErrorValidator.ifErrors,
  groupController.updateGroup
);

router.put("/upload", auth, upload, groupController.uploadImage);

router.delete("/remove", auth, groupController.removeImage);

router.get("/summary", auth, groupController.displayGroups);

router.put("/join", auth, groupController.joinGroup);

router.put("/delete-member", auth, groupController.deleteMember);

router.put("/delete-group", auth, groupController.deleteGroup);

router.post(
  "/initiate-payment",
  // AccountValidator.updateAccount,
  // ErrorValidator.ifErrors,
  groupController.initiatePayment
);

router.post(
  "/reset-payment",
  auth,
  // AccountValidator.updateAccount,
  // ErrorValidator.ifErrors,
  groupController.resetPayments
);

// router.get(
//   "/adjustments",
//   // AccountValidator.updateAccount,
//   // ErrorValidator.ifErrors,
//   groupController.getAdjustments
// );

router.put("/acknowledge", auth, groupController.acknowledgePayment);

module.exports = router;
