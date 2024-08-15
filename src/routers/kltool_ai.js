const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const kltoolAI = require("../utils/kltool_ai");

router.get("/kltool-ai", auth, async (req, res) => {
  res.render("kltool_ai");
});

router.post("/search/kltool-ai", auth, async (req, res) => {
  const search_string = req.body.search_string;
  if (search_string) {
    const result = await kltoolAI(search_string);
    res.send({
      result: result
    })
  }
});

module.exports = router;