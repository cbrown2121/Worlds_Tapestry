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

// GET a single user profile
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM users WHERE UserID = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query failed" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// GET conversation between two users
app.get("/messages/conversation/:user1-:user2", (req, res) => {
  const { user1, user2 } = req.params;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "user1 and user2 are required" });
  }

  db.query(
    `SELECT *
     FROM Messages
     WHERE (SenderID = ? AND ReceiverID = ?)
        OR (SenderID = ? AND ReceiverID = ?)
     ORDER BY SentAt ASC, MessageID ASC`,
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Query failed" });
      }
      res.json(results);
    }
  );
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

// GET categories for a specific forum
app.get("/categories/:forumID", (req, res) => {
  const sql = `SELECT * FROM categories WHERE ForumID = ?`;

  db.query(sql, [req.params.forumID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET threads for a specific categories
app.get("/threads/:categoryID", (req, res) => {
  const sql = `SELECT * FROM threads WHERE CategoryID = ?`;

  db.query(sql, [req.params.categoryID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET posts for specific threads
app.get("/posts/:threadID", (req, res) => {
  const sql = `SELECT * FROM posts WHERE ThreadID = ?`;

  db.query(sql, [req.params.threadID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST Endpoints
// POST forums
app.post("/forums", (req, res) => {
  const { forum_id, forum_name, creation_date, member_count, tags, search_visibility, join_permissions } = req.body;

  const sql = `// query to insert forum 
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

// POST a new message
app.post("/messages", (req, res) => {
  const { SenderID, ReceiverID, MessageText } = req.body;

  if (!SenderID || !ReceiverID || !MessageText) {
    return res.status(400).json({ error: "SenderID, ReceiverID, and MessageText are required" });
  }

  db.query(
    `INSERT INTO Messages (SenderID, ReceiverID, MessageText, SentAt)
     VALUES (?, ?, ?, NOW())`,
    [SenderID, ReceiverID, MessageText],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Insert failed" });
      }
      res.json({ ok: true, MessageID: result.insertId });
    }
  );
});

// DELETE Endpoints
// DELETE forums
app.delete("/forums/:id", (req, res) => {
  const id = req.params.id.trim();

  const sql = "DELETE FROM forums WHERE ForumID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Forum not found" });

    res.json({ message: "Forum deleted" });
  });
});

// DELETE events
app.delete("/events/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM events WHERE EventID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  });
});

// DELETE locations
app.delete("/location/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM location WHERE LocationID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Location not found" });

    res.json({ message: "Location deleted" });
  });
});

// DELETE Posts
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM posts WHERE PostID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted" });
  });
});

// DELETE Reports
app.delete("/reports/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM reports WHERE ForumID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted" });
  });
});

// DELETE Threads
app.delete("/threads/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM threads WHERE ThreadsID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Thread not found" });

    res.json({ message: "Thread deleted" });
  });
});

// DELETE UserPins
app.delete("/userpins/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM userpins WHERE PinID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pin not found" });

    res.json({ message: "User pin deleted" });
  });
});

// DELETE Users
app.delete("/users/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM users WHERE UserID = ?", [id], (err, result) => {
    if (err) {
      if (err.errno === 1451)
        return res.status(409).json({
          message: "Cannot delete user with related records"
        });

      return res.status(500).json(err);
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  });
});

// PUT Endpoints
// PUT postID **still needs to update content and status**

app.put("/posts/:id", (req, res) => {
  const postID = req.params.id;
  const { likes, dislikes } = req.body;

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


// PATCH forums
app.patch("/forums/:id", (req, res) => {
  const id = req.params.id.trim();

  // Whitelisted columns
  const allowedFields = [
    "ForumName",
    "Tags",
    "SearchVisibility",
    "JoinPermissions"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({
      message: "No valid fields provided for update"
    });
  }

  values.push(id);

  const sql = `
    UPDATE forums
    SET ${updates.join(", ")}
    WHERE ForumID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Forum not found" });
    }

    res.json({ message: "Forum updated successfully" });
  });
});

// PATCH events
app.patch("/events/:id", (req, res) => {
  const id = req.params.id.trim();

  // Whitelisted columns
  const allowedFields = [
    "LocationID",
    "EventName",
    "Reviews",
    "Status",
    "Latitude",
    "Longitude"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE events
    SET ${updates.join(", ")}
    WHERE EventID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "Event updated successfully" });
  });
});

// PATCH Location
app.patch("/location/:id", (req, res) => {
  const id = req.params.id.trim();

  // White listed columns
  const allowedFields = [
    "LocationName",
    "Reviews",
    "Status",
    "Latitude",
    "Longitude"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE location
    SET ${updates.join(", ")}
    WHERE LocationID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Location not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "Location updated successfully" });
  });
});

// PATCH Posts
app.patch("/posts/:id", (req, res) => {
  const id = req.params.id.trim();

  // White listed columns
  const allowedFields = [
    "Status",
    "Replies",
    "Content",
    "Subject"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE posts
    SET ${updates.join(", ")}
    WHERE PostID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "Post updated successfully" });
  });
});

// PATCH Threads
app.patch("/threads/:id", (req, res) => {
  const id = req.params.id.trim();

  // White listed columns
  const allowedFields = [
    "ThreadName",
    "Locked",
    "WhoCanPost"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE threads
    SET ${updates.join(", ")}
    WHERE ThreadsID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Thread not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "Thread updated successfully" });
  });
});

// PATCH Reports
app.patch("/reports/:id", (req, res) => {
  const id = req.params.id.trim();

  // White listed columns
  const allowedFields = [
    "IssueType",
    "Subject"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE reports
    SET ${updates.join(", ")}
    WHERE ReportID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Report not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "Report updated successfully" });
  });
});

app.patch("/users/:id", (req, res) => {
  const id = req.params.id.trim();

  const allowedFields = [
    "UserName",
    "Email",
    "Role"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "No valid fields provided" });

  values.push(id);

  const sql = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE UserID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    if (result.changedRows === 0)
      return res.json({ message: "No changes made" });

    res.json({ message: "User updated successfully" });
  });
});