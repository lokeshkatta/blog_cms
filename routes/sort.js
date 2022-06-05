const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/sqlite.db");

router.get("/", checkNotAuthenticated, (req, res) => {
  db.all(
    "SELECT * FROM Blogs order by createdAt desc",
    function (error, results) {
      //  console.log(results)
      res.render("index", { articles: results });
    }
  );
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/auth/home");
  }
  next();
}

module.exports = router;
