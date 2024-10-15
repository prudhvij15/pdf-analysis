// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");
const authenticateUser = require("../middleware/authmiddleware.js");
const userAuth = require("../controller/userAuth.js");
router.post("/upload", uploadController.uploadFileHandler);
router.post("/login", userAuth.user);
router.post("/signup", userAuth.userCreate);
router.get("/verifyToken", authenticateUser, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
