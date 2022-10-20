const mysql = require("mysql2");
const express = require("express");
const uuid = require("uuid");
const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  db.query("CREATE DATABASE course6225", function (err, result) {
    console.log("Database created");
    let sql = "use course6225";
    db.query(sql, (err) => {
      if (err) throw err;
      let sql2 = "drop table if exists useraccount";
      db.query(sql2, (err) => {
        if (err) throw err;
        let sql3 =
          "CREATE TABLE useraccount(id varchar(255),first_name varchar(255), last_name varchar(255), password varchar(255), username varchar(255), account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, account_updated varchar(255))";
        db.query(sql3, (err) => {
          if (err) throw err;
          console.log("database and table are created!");
        });
      });
    });
  });
});

//main page
app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

//create table
app.get("/createtable", (req, res) => {
  let sql =
    "CREATE TABLE useraccount(id varchar(255),first_name varchar(255), last_name varchar(255), password varchar(255), username varchar(255), account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, account_updated varchar(255))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Employee table created");
  });
});

//create new user
app.post("/v1/account", (req, res) => {
  let post = {
    first_name: "Tom",
    last_name: "Wang",
    password: uuid.v4(),
    username: "cde@gmail.com",
    id: uuid.v4(),
  };
  let sql = "INSERT INTO useraccount SET ?";
  let query = db.query(sql, post, (err) => {
    if (err) {
      throw err;
    }
    let sql = `select id, first_name, last_name, username, account_created, account_updated from useraccount`;
    let newquery = db.query(sql, (err, newrows) => {
      res.send(newrows);
    });
  });
});

//get user information
app.get("/v1/account/:id", (req, res) => {
  let sql = `select id, first_name, last_name, username, account_created, account_updated from useraccount where id = '${req.params.id}' `;
  let query = db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      res.send(rows);
    } else {
      res.sendStatus(400);
    }
  });
});

//update user information
app.put("/v1/account/:id", (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  let putInfo = {
    first_name: "John",
    last_name: "Kevin",
    password: "666666",
    account_updated: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  };
  let sql = `UPDATE useraccount SET account_updated = '${dateTime}' where id = '${req.params.id}' `;
  let query = db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    } else {
      let sql2 = `select id, first_name, last_name, username, account_created, account_updated from useraccount where id= '${req.params.id}' `;
      let newQuery = db.query(sql2, (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(rows);
      });
    }
  });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
