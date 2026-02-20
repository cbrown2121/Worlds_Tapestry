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

// GET Endpoints
// GET location
app.get("/location", (req, res) => {
  db.query("SELECT * FROM location", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query failed" });
    }
    res.json(results);
  });
});

// GET users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET forums
app.get("/forums", (req, res) => {
  db.query("SELECT * FROM forums", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/forums/:forumID", (req, res) => {
  const sql = `SELECT * FROM forums WHERE ForumID = ?`;

  db.query(sql, [req.params.forumID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET posts
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET events
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET reports
app.get("/Reports", (req, res) => {
  db.query("SELECT * FROM Reports", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET userpins
app.get("/userpins", (req, res) => {
  db.query("SELECT * FROM userpins", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET messages
app.get("/Messages", (req, res) => {
  db.query("SELECT * FROM Messages", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET threads
app.get("/threads", (req, res) => {
  db.query("SELECT * FROM threads", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST Endpoints
// POST forums
app.post("/forums", (req, res) => {
  const { forum_id, forum_name, creation_date, member_count, tags, search_visibility, join_permissions } = req.body;

  const sql = `// query to insert forum 
    INSERT INTO forums (ForumID, ForumName, CreationDate, MemberCount, SettingsID, Tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [forum_id, forum_name, creation_date, member_count, tags, search_visibility, join_permissions], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create forum" });
    }

    res.json({ message: "Forum created", id: result.insertId });
  });
});

// POST threads
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

// POST userpins
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

// POST posts
app.post("/posts", (req, res) => {
  const { creator, creation_date, status, replies, content, likes, dislikes, subject } = req.body;

  // query for posting likes
  const sql = ` 
    INSERT INTO posts (Creator, Creation_Date, Status, Replies, Content, likes, dislikes, subject )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [creator, creation_date, status, replies, content, likes, dislikes, subject], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create post" });
    }

    res.json({ message: "post created", id: result.insertId });
  });
});

// POST location
app.post("/location", (req, res) => {
  const { location_id, location_name, reviews, status, latitude, longitute } = req.body;

  // query for posting locations
  const sql = ` 
    INSERT INTO location (LocationID, LocationName, Reviews, Status, Latitude, Longitute)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [location_id, location_name, reviews, status, latitude, longitute], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create location" });
    }

    res.json({ message: "location created", id: result.insertId });
  });
});

//POST events
app.post("/events", (req, res) => {
  const { event_id, location_id, event_name, reviews, status, latitude, longitute } = req.body;

  // query for posting events
  const sql = ` 
    INSERT INTO events (EventID, LocationID, EventName, Reviews, Status, Latitude, Longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [event_id, location_id, event_name, reviews, status, latitude, longitute], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create event" });
    }

    res.json({ message: "event created", id: result.insertId });
  });
});

// POST reports
app.post("/reports", (req, res) => {
  const { forum_id, page_link, issue_type, subject, form_submit} = req.body;

  // query for posting reports
  // **Currently does not allow for a duplicate forumID**
  const sql = ` 
    INSERT INTO reports (ForumID, PageLink, IssueType, Subject, FormSubmit)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [forum_id, page_link, issue_type, subject, form_submit], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create report" });
    }

    res.json({ message: "report created", id: result.insertId });
  });
});

// POST users
app.post("/users", (req, res) => {
  const { user_id, user_name, email, creation_date, role} = req.body;

  // query for posting users
  const sql = ` 
    INSERT INTO users (UserID, UserName, Email, CreationDate, Role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, user_name, email, creation_date, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create user" });
    }

    res.json({ message: "user created", id: result.insertId });
  });
});
// PUT Endpoints
// PUT postID
app.put("/posts/:id", (req, res) => {
  const postID = req.params.id;
  const { creator, creation_date, status, replies, content, likes, dislikes, subject } = req.body;

  const sql = `
    UPDATE posts
    SET likes = ?, dislikes = ?
    WHERE PostID = ?
  `;

  db.query(sql, [likes, dislikes, postID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update post" });
    }

    res.json({ message: "Post updated" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});