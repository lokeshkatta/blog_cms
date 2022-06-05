const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/sqlite.db");

router.get("/getall", (req, res) => {
  db.all("SELECT * FROM UnderReview", function (error, results) {
    res.send(results);
  });
});

// router.get("/", checkNotAuthenticated, (req, res) => {
//   res.send("Hello Curious");
// });
router.get("/idU/:id", checkNotAuthenticated, async (req, res) => {
  const article = await getU(req.params.id);
  res.render("show", { article: article[0] });
});

router.get("/idB/:id", async (req, res) => {
  const article = await getB(req.params.id);
  res.render("show", { article: article[0] });
});

router.get("/new", checkNotAuthenticated, (req, res) => {
  article = {};
  res.render("articles/new", { article: article });
});

router.post("/deleteU/:id", checkNotAuthenticated, (req, res) => {
  DeleteU(req.params.id).then(res.redirect("/auth/home"));
});

router.post("/deleteB/:id", checkNotAuthenticated, async (req, res) => {
  await DeleteB(req.params.id);
  res.redirect("/auth/home");
});

router.get("/edit/:id", checkNotAuthenticated, async (req, res) => {
  const article = await getB(req.params.id);
//   console.log(article[0]);
  res.render("articles/edit", { article: article[0] });
});

router.post("/new", checkNotAuthenticated, (req, res) => {
  if (req.body.BlogId) {
    insertU(
      req.body.title,
      req.body.description,
      req.body.blog,
      req.user.Username,
      req.body.BlogId
    ).then(res.redirect("/auth/home"));
  } else {
    insertU(
      req.body.title,
      req.body.description,
      req.body.blog,
      req.user.Username
    ).then(res.redirect("/auth/home"));
  }
});

router.post("/publish/:id", checkNotAuthenticated, async (req, res) => {
  const article = await getU(req.params.id);
  // console.log(article[0])
  await DeleteUinsertB(req.params.id, article[0]);
  res.redirect("/auth/home");
});

router.put("/edit/:id", checkNotAuthenticated, async (req, res) => {
  insertU(
    req.body.title,
    req.body.description,
    req.body.blog,
    req.user.Username,
    req.params.id
  ).then(res.redirect("/auth/home"));
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/");
  }
  // next();
}

function insertU(title, description, blog, Username, BlogId = 0) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "INSERT INTO UnderReview (title, description, blog, author, createdAt,BlogId) VALUES (?,?,?,?,?,?)",
        [title, description, blog, Username, Date("now"), BlogId],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  });
}

function DeleteUinsertB(id, article) {
  if (article.BlogId == 0) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("DELETE FROM UnderReview WHERE id=(?)", [id]).run(
          "INSERT INTO Blogs (title, description, blog, author, createdAt) VALUES (?,?,?,?,?)",
          [
            article.title,
            article.description,
            article.blog,
            article.author,
            Date("now"),
          ],
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
        db.run("DELETE FROM UnderReview WHERE id=(?)", [id]).run(
          "UPDATE Blogs SET title=(?), description=(?), blog=(?), author=(?), createdAt=(?)  WHERE Id=(?)",
          [
            article.title,
            article.description,
            article.blog,
            article.author,
            Date("now"),
            article.BlogId,
          ],
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  }
}

function getU(id) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(
        "SELECT * FROM UnderReview WHERE Id = ?",
        [id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  });
}

function getB(id) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all("SELECT * FROM Blogs WHERE Id = ?", [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  });
}

function DeleteU(id) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "DELETE FROM UnderReview WHERE id=(?)",
        [id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  });
}

function DeleteB(id) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM Blogs WHERE id=(?)", [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  });
}

module.exports = router;
