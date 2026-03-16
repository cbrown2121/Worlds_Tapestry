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
  multipleStatements: true
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
  db.query("SELECT * FROM Location", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query failed" });
    }
    res.json(results);
  });
});

// GET users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET users who are in a certain forum
app.get("/:forumID/users", (req, res) => {
  const { forumID } = req.params;

  const SQL = 
              ` SELECT DISTINCT * FROM MemberList 
              	INNER JOIN Users u ON MemberList.UserID = u.UserID
                WHERE MemberList.ForumID = ?;`;

  db.query(SQL, [forumID], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET a single user profile
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM Users WHERE UserID = ?", [id], (err, results) => {
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
  db.query("SELECT * FROM Forums", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/forums/:forumID", (req, res) => {
  const sql = `SELECT * FROM Forums WHERE ForumID = ?`;

  db.query(sql, [req.params.forumID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/maps/:forumID", (req, res) => {
  const sql = `SELECT * FROM Maps WHERE ForumID = ?`;

  db.query(sql, [req.params.forumID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET forums that the user is in
app.get("/usersforums/:userID", (req, res) => {
  // a forum will only be returned if there is a row in the UsersInForum table where the primary key is the given UserID
  const sql = `SELECT * FROM Forums forums WHERE EXISTS (SELECT 1 FROM MemberList WHERE ForumID = forums.ForumID AND UserID = ?)`; 

  db.query(sql, [req.params.userID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// check if user is in given forum
app.get("/forum-membership/:forumID/:userID", (req, res) => {
  const sql = `SELECT * FROM MemberList WHERE ForumID = ? AND UserID = ?;`; 

  db.query(sql, [req.params.forumID, req.params.userID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET posts
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM Posts", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET events
app.get("/events", (req, res) => {
  db.query("SELECT * FROM Events", (err, results) => {
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
  db.query("SELECT * FROM Userpins", (err, results) => {
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
  db.query("SELECT * FROM Threads", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET (original post) threads from forums the user is a member of
app.get("/user-dash-threads/:userID", (req, res) => {
  const sql = 
            ` SELECT Threads.ThreadID, Threads.CategoryID, Threads.CreatorID, p.Content, u.UserName FROM Threads
                INNER JOIN Categories c ON Threads.CategoryID = c.CategoryID
                INNER JOIN MemberList m ON c.ForumID = m.ForumID
                INNER JOIN Posts p ON Threads.ThreadID = p.ThreadID
                INNER JOIN Users u ON Threads.CreatorID = u.UserID
              WHERE m.UserID = ? AND p.OriginalThreadPost = 1;`; // posts are original threads if their value is 1 (true)
  
  db.query(sql, [req.params.userID], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET categories for a specific forum
app.get("/categories/:forumID", (req, res) => {
  const sql = `SELECT * FROM Categories WHERE ForumID = ?`;

  db.query(sql, [req.params.forumID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET threads for a specific categories
app.get("/threads/:categoryID", (req, res) => {
  const sql = `SELECT * FROM Threads WHERE CategoryID = ?`;

  db.query(sql, [req.params.categoryID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET posts for specific threads
app.get("/posts/:threadID", (req, res) => {
  const sql = `SELECT * FROM Posts INNER JOIN Users u ON Posts.UserID = u.UserID WHERE ThreadID = ?;`;

  db.query(sql, [req.params.threadID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET if the user has interated with a post
app.get("/post-ratings/:PostID/:UserID", (req, res) => {
  const { PostID, UserID } = req.params;

  const sql = `SELECT * FROM PostRatings WHERE PostID = ? AND UserID = ?`;

  db.query(sql, [PostID, UserID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET location data for a forum (center of map)
app.get("/maps/:forumID", (req, res) => {
  const forumID = req.params.forumID;

  const sql = `
    SELECT l.LocationID, l.Latitude, l.Longitude
    FROM Locations l
    JOIN Forums f ON f.LocationID = l.LocationID
    WHERE f.ForumID = ?
  `;

  db.query(sql, [forumID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load forum map location" });
    }

    res.json(results);
  });
});

app.get("/maps/forum/:forumID", (req, res) => {
  const { forumID } = req.params;

  const sql = `SELECT * FROM Maps WHERE ForumID = ? LIMIT 1`;

  db.query(sql, [forumID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch map" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No map found for this forum" });
    }

    res.json(results[0]);
  });
});

app.get("/userpins/map/:mapID", (req, res) => {
  const { mapID } = req.params;

  const sql = `SELECT * FROM Userpins WHERE MapID = ?`;

  db.query(sql, [mapID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch pins" });
    }

    res.json(results);
  });
});

// POST Endpoints
// POST forums
app.post("/forums", (req, res) => {
  const { ForumName, SearchVisibility, JoinPermissions, AllowMaps, UserID } = req.body; // add in tags later the form currently doesnt support them

  // query to insert forum 
  const sql = `
    INSERT INTO Forums (ForumName, SearchVisibility, JoinPermissions, AllowMaps, OwnerID)
    VALUES (?, ?, ?, ?, ?)
  `;

  // datetime- forum id- member count are all generated automatically on mysqls end

  db.query(sql, [ForumName, SearchVisibility, JoinPermissions, AllowMaps, UserID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create forum" });
    }

    res.json({ message: "Forum created", id: result.insertId });
  });
});

app.post("/add-user-to-forum", (req, res) => {
  const { UserID, ForumID, UserRole } = req.body;

  const sql = `
    INSERT INTO MemberList (UserID, ForumID, UserRole)
    VALUES (?, ?, ?);

    UPDATE Forums 
    SET MemberCount = MemberCount + 1 
    WHERE ForumID = ?;
  `;

  db.query(sql, [UserID, ForumID, UserRole, ForumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add user to forum" });
    }

    res.json({ message: "User membership with forum created", id: result.insertId });
  });
});

// POST threads
app.post("/threads", (req, res) => {
  const { threads_id, post_id, who_can_post } = req.body;

  const sql = `
    INSERT INTO Threads (ThreadID, PostID, WhoCanPost)
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

// POST categories
app.post("/category", (req, res) => {
  const { CategoryName, CategoryDescription, PinnedStatus, ForumID } = req.body;

  const sql = `
    INSERT INTO Categories (CategoryName, Description, Pinned, ForumID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [CategoryName, CategoryDescription, PinnedStatus, ForumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create category" });
    }

    res.json({ message: "CategoryID created", id: result.insertId });
  });
});

// POST userpins
app.post("/userpins", (req, res) => {
  const { user_id, map_id, visibility, longitude, latitude, title, description} = req.body;

  const sql = `
    INSERT INTO Userpins ( UserID, MapID, Visibility, Longitude, Latitude, Title, Description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [ user_id, map_id, visibility, longitude, latitude, title, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create pin" });
    }

    res.json({ message: "Pin created", id: result.insertId });
  });
});


app.post("/posts", (req, res) => {
  const { creator, thread_id, content } = req.body;

  // query for posting likes
  const sql = ` 
    INSERT INTO Posts (UserID, ThreadID, Content)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [creator, thread_id, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create post" });
    }

    res.json({ message: "post created", id: result.insertId });
  });
});

// POST location
app.post("/location", (req, res) => {
  const { location_id, location_name, reviews, status, latitude, longitude } = req.body;

  // query for posting locations
  const sql = ` 
    INSERT INTO Location (LocationID, LocationName, Reviews, Status, Latitude, Longitude)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [location_id, location_name, reviews, status, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create location" });
    }

    res.json({ message: "location created", id: result.insertId });
  });
});

//POST events
app.post("/events", (req, res) => {
  const { event_id, location_id, event_name, reviews, status, latitude, longitude } = req.body;

  // query for posting events
  const sql = ` 
    INSERT INTO Events (EventID, LocationID, EventName, Reviews, Status, Latitude, Longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [event_id, location_id, event_name, reviews, status, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create event" });
    }

    res.json({ message: "event created", id: result.insertId });
  });
});

// POST bug report
app.post("/bug-reports", (req, res) => {
  const { IssueType, Subject } = req.body;

  // query for posting reports
  // **Currently does not allow for a duplicate forumID**
  const sql = ` 
    INSERT INTO Reports (IssueType, Subject)
    VALUES (?, ?)
  `;

  db.query(sql, [IssueType, Subject], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create report" });
    }

    res.json({ message: "report created", id: result.insertId });
  });
});

// POST reports
app.post("/reports", (req, res) => {
  const { forum_id, page_link, issue_type, subject, form_submit} = req.body;

  // query for posting reports
  // **Currently does not allow for a duplicate forumID**
  const sql = ` 
    INSERT INTO Reports (ForumID, PageLink, IssueType, Subject, FormSubmit)
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
    INSERT INTO Users (UserID, UserName, Email, CreationDate, Role)
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

  const sql = "DELETE FROM Forums WHERE ForumID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Forum not found" });

    res.json({ message: "Forum deleted" });
  });
});

// remove user forum a forums member list
app.delete("/remove-user-from-forum", (req, res) => {
  const { UserID, ForumID } = req.body;

  const sql = `
    DELETE FROM MemberList WHERE ForumID = ? AND UserID = ?;

    UPDATE Forums 
    SET MemberCount = MemberCount - 1 
    WHERE ForumID = ?;
  `;

  db.query(sql, [ ForumID, UserID, ForumID ], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "The user was not in that forum" });

    res.json({ message: "User removed from forum member list" });
  });
});

// DELETE events
app.delete("/events/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Events WHERE EventID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  });
});

// DELETE locations
app.delete("/location/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Location WHERE LocationID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Location not found" });

    res.json({ message: "Location deleted" });
  });
});

// DELETE Posts
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Posts WHERE PostID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted" });
  });
});

// DELETE Reports
app.delete("/reports/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Reports WHERE ForumID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted" });
  });
});

// DELETE Threads
app.delete("/threads/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Threads WHERE ThreadID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Thread not found" });

    res.json({ message: "Thread deleted" });
  });
});

// DELETE UserPins
app.delete("/userpins/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Userpins WHERE PinID = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pin not found" });

    res.json({ message: "User pin deleted" });
  });
});

// DELETE Users
app.delete("/users/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query("DELETE FROM Users WHERE UserID = ?", [id], (err, result) => {
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
app.put("/posts/:id", (req, res) => {
  const postID = req.params.id;
  const { likes, dislikes } = req.body;

  const sql = `
    UPDATE Posts
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

// PUT post and update PostRating table
app.put("/change-post-rating", (req, res) => {
  const { postID, likes, dislikes, userID, rating } = req.body;

  let sql;
  let value_list;

  if (rating == "remove") {
    sql = ` UPDATE Posts
            SET likes = ?, dislikes = ?
            WHERE PostID = ?;
            
            DELETE FROM PostRatings WHERE PostID = ? AND UserID = ?`
  value_list = [likes, dislikes, postID, postID, userID];

  } else {
    sql = ` UPDATE Posts
            SET likes = ?, dislikes = ?
            WHERE PostID = ?;

            INSERT INTO PostRatings (PostID, UserID, Rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE Rating = ?;`
    value_list = [likes, dislikes, postID, postID, userID, rating, rating];
  }

  db.query(sql, value_list, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update post" });
    }

    res.json({ message: "Post updated" });
  });
});

// PUT lat long into map
app.put("/map/update-lat-long", (req, res) => {
  const { ForumID, latitude, longitude } = req.body;

  if (isNaN(latitude) || isNaN(longitude)) { // should move this to actual code and not backend. ill work on it later
    return res.status(500).json({ error: "Failed to update Maps- Input is invalid" });
  }

  let sql = ` UPDATE Maps
              SET Latitude = ?, Longitude = ?
              WHERE ForumID = ?;`

  db.query(sql, [latitude, longitude, ForumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update Maps" });
    }

    res.json({ message: "Map updated" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// change a user role (this is the only field in the category that will change so i thought making a patch would be overkill)
app.put("/memberlist-change-role", (req, res) => {
  const { UserID, ForumID, UserRole } = req.body;

  const sql = `
    UPDATE MemberList
    SET UserRole = ?
    WHERE UserID = ? AND ForumID = ?
  `; 

  db.query(sql, [UserRole, UserID, ForumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update post" });
    }

    res.json({ message: "Post updated" });
  });
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
    UPDATE Forums
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
    UPDATE Events
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
    UPDATE Location
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
    "Subject",
    "Deleted"
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
    UPDATE Posts
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
    UPDATE Threads
    SET ${updates.join(", ")}
    WHERE ThreadID = ?
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
    UPDATE Reports
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
    UPDATE Users
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