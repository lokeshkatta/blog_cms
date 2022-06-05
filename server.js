require("dotenv").config();
const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const passport = require("passport");
const articleRouter = require("./routes/articles");
const sortRouter = require("./routes/sort");
const authRouter = require("./routes/auth");
var db = new sqlite3.Database("./database/sqlite.db");
const session = require("express-session");
const flash = require("express-flash");

app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");

//config session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 86400000 1 day
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkNotAuthenticated, (req, res) => {
  db.all("SELECT * FROM Blogs", function (error, results) {
    res.render("index", { articles: results });
  });
});
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/auth/home");
  }
  next();
}

app.use("/sort", sortRouter);
app.use("/auth", authRouter);
app.use("/articles", articleRouter);

let port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Running on ${port}!`)
);
