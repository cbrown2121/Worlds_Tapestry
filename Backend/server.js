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

app.post("/forums", (req, res) => {
  const { forum_id, forum_name, creation_date, member_count, tags, search_visibility, join_permissions } = req.body;

  const sql = `
    INSERT INTO forums (ForumID, ForumName, CreationDate, MemberCount, Tags, SearchVisibility, JoinPermissions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [forum_id, forum_name, creation_date, member_count, tags, search_visibility, join_permissions], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create forum" });
    }

    res.json({ message: "Forum created", id: result.insertId });
  });
});


app.post("/threads", (req, res) => {
  const { threads_id, post_id, who_can_post } = req.body;

  const sql = `
    INSERT INTO threads (ThreadsID, PostID, WhoCanPost)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [threads_id, post_id, who_can_post], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create thread" });
    }

    res.json({ message: "Thread created", id: result.insertId });
  });
});

app.post("/userpins", (req, res) => {
  const { pin_id, user_id, coordinates, visibility } = req.body;

  const sql = `
    INSERT INTO threads (ThreadsID, PostID, WhoCanPost)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [pin_id, post_id, who_can_post], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create thread" });
    }

    res.json({ message: "Thread created", id: result.insertId });
  });
});

app.post("/posts", (req, res) => {
  const { creator, creation_date, status, content, likesdislikes } = req.body;

  const sql = `
    INSERT INTO posts (Creator, Creation_Date, Status, Replies, Content, likesdislikes )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [creator, creation_date, status, content, likesdislikes], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create post" });
    }

    res.json({ message: "post created", id: result.insertId });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});