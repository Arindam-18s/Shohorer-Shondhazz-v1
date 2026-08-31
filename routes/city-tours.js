const { Router } = require("express");
const multer = require("multer");
const path = require("path"); //so that we dont always have to use the absolute path

const router = Router();

router.get("/", async (req, res) => {
  res.render("city-tours", {
    user: req.user,
  });
});

module.exports = router;