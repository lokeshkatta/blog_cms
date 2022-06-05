const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./database/sqlite.db", (err) => {
  if (err) {
    console.error(err.message);
  }
});


db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Username text, 
        Email text, 
        Password text,
        DateCreated DATE
        )`,
    (err) => {
      if (err) {
        console.log("Some Error Occured");
      } else {
        console.log("Table Created");
      }
    }
  );
  //   ).run(
  //     "INSERT INTO Users (Username, Email, Password, DateCreated) VALUES (?,?,?,?)",
  //     ["superadmin", "super@admin.com", "superadmin", Date("now")]
  //   );

  var insert =
    "INSERT INTO Blogs (title, description, blog, author, createdAt) VALUES (?,?,?,?,?)";
  db.run(
    `CREATE TABLE Blogs (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title text, 
                 description text,
                 blog text,
                 author text,
                 createdAt DATE
                 )`,
    (err) => {
      if (err) {
        console.log("Some Error Occured");
      } else {
        console.log("Table Created");
      }
    }
  )
    .run(insert, [
      "Tile Name 1",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ])
    .run(insert, [
      "Tile Name 2",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ])
    .run(insert, [
      "Tile Name 3",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ])
    .run(insert, [
      "Tile Name 4",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ])
    .run(insert, [
      "Tile Name 5",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ])
    .run(insert, [
      "Tile Name 6",
      "Tile Name 2 ",
      "fsfjlskfjklsjfjs fkjsdlfkdsjf fsdlkfjlskdj",
      "fslkfs",
      Date("now"),
    ]);
});

db.run(
  `CREATE TABLE UnderReview (
               Id INTEGER PRIMARY KEY AUTOINCREMENT,
               title text, 
               description text,
               blog text,
               author text,
               createdAt DATE,
               BlogId INTEGER
               )`,
  (err) => {
    if (err) {
      console.log("Some Error Occured");
    } else {
      console.log("Table Created");
    }
  }
);

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});
