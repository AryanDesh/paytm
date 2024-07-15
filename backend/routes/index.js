// backend/user/index.js
const express = require('express');
const userRouter = require("./user");
const accountRouter = require("./account");
const adminRouter = require("./admin");
const vendorRouter = require("./vendor");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/admin", adminRouter);
router.use("/vendor", vendorRouter);

module.exports = router;