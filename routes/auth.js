const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./database/sqlite.db");
const passport = require("passport");

const initializePassport = require("../passport-config");
initializePassport(
  passport,
  (email) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM Users WHERE Email = ?",
          [email],
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  },
  (id) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("SELECT * FROM Users WHERE Id = ?", [id], function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        });
      });
    });
  }
);

router.get("/home", checkAuthenticated, async (req, res) => {
  // console.log(req.user.Username)
  let data = {
    name: req.user.Username,
  };
  if (req.user.Username == "superadmin") {
    // console.log("superadmin Logged In")
    // console.log(data.name)
    data.articles1 = await getUnder();
    data.articles2 = await getBlog();
    res.render("superadmin/home", { data: data });
  } else {
    // console.log(await getBlog(data.name))
    data.articles1 = await getUnder(data.name);
    data.articles2 = await getBlog(data.name);
    // console.log(data.articles2)
    res.render("admin/home", { data: data });
  }
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.run(
      "INSERT INTO Users (Username, Email, Password, DateCreated) VALUES (?,?,?,?)",
      [req.body.name, req.body.email, hashedPassword, Date("now")]
    );
    res.redirect("/auth/login");
  } catch (e) {
    res.redirect("/auth/register");
    //  console.log(e)
  }
});

router.get("/getall", (req, res) => {
  db.all("SELECT * FROM Users", function (error, results) {
    res.send(results);
  });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/auth/home",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/auth/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/auth/home");
  }
  next();
}

function getUnder(Username = "superadmin") {
  if (Username == "superadmin") {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(
          "SELECT * FROM UnderReview order by createdAt desc",
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(
          "SELECT * FROM UnderReview WHERE author = ? order by createdAt desc",
          [Username],
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  }
}

function getBlog(Username = "superadmin") {
  if (Username == "superadmin") {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("SELECT * FROM Blogs", function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        });
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(
          "SELECT * FROM Blogs WHERE author = ?",
          [Username],
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  }
}

module.exports = router;
