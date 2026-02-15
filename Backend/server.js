// @ts-nocheck
/* eslint-env node */

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT,
});

// Test connection
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 AS ok", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database connection failed" });
    }
    res.json({ message: "Database connected!", results });
  });
});

// REAL DATA ROUTE
app.get("/location", (req, res) => {
  db.query("SELECT * FROM location", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query failed" });
    }
    res.json(results);
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/forums", (req, res) => {
  db.query("SELECT * FROM forums", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/Reports", (req, res) => {
  db.query("SELECT * FROM Reports", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/userpins", (req, res) => {
  db.query("SELECT * FROM userpins", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/Messages", (req, res) => {
  db.query("SELECT * FROM Messages", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/threads", (req, res) => {
  db.query("SELECT * FROM threads", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/forumsettings", (req, res) => {
  db.query("SELECT * FROM forumsettings", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});