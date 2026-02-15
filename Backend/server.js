// @ts-nocheck
/* eslint-env node */

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());
// =============================
// HEALTH / TEST ROUTES
// =============================

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


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
// =============================
// USER PROFILE ROUTES
// =============================

// Get a single user profile
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

// Update a user profile
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { UserName, Email, Role } = req.body;

  db.query(
    `UPDATE users
     SET UserName = COALESCE(?, UserName),
         Email = COALESCE(?, Email),
         Role = COALESCE(?, Role)
     WHERE UserID = ?`,
    [UserName, Email, Role, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ ok: true, affectedRows: result.affectedRows });
    }
  );
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
// =============================
// DIRECT MESSAGING ROUTES
// =============================

// Get conversation between two users
app.get("/api/messages/conversation", (req, res) => {
  const { user1, user2 } = req.query;

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

// Send a new message
app.post("/api/messages", (req, res) => {
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
