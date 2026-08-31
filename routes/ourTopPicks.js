const { Router } = require("express");

const path = require("path"); //so that we dont always have to use the absolute path

const router = Router();

router.get("/", (req, res) => {
    return res.render("our-top-picks.ejs", {
    user: req.user,
  });
})

module.exports = router;