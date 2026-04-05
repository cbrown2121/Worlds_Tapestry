// @ts-nocheck
/* eslint-env node */

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

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

// get user by user name
app.get("/user-:UserName", (req, res) => {
  const { UserName } = req.params;

  db.query("SELECT * FROM Users WHERE UserName = ?", [UserName], (err, results) => {
    if (err) return res.json({successful: false, result: err});;
    return res.json({successful: true, result: results});
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

// GET forum by name
app.get("/:forumID/forumName", (req, res) => {
  const { forumName } = req.params;

  const SQL = 
              ` SELECT Forum
                WHERE ForumName = ?;`;

  db.query(SQL, [forumName], (err, results) => {
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

// check if a user is is in the database
app.get("/check-user/:UserName/:Email", (req, res) => {
  const { UserName, Email } = req.params;

  const sql = `SELECT COUNT(*) AS users_in_database 
                FROM Users
                WHERE UserName = ? OR Email = ?;`

  db.query(sql, [UserName, Email], (err, results) => {
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
    `SELECT 
     MessageID, SenderID, ReceiverID, MessageText, SentAt, UserName
     FROM Messages JOIN Users on SenderID = UserID
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

// GET public forums
app.get("/public-forums", (req, res) => {
  const SQL = `SELECT * FROM Forums WHERE SearchVisibility != "Hidden" ORDER BY MostRecentActivity DESC;`

  db.query(SQL, (err, results) => {
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
app.get("/user-forums/:userID", (req, res) => {
  // a forum will only be returned if there is a row in the UsersInForum table where the primary key is the given UserID
  const sql = `SELECT * FROM Forums forums WHERE EXISTS (SELECT 1 FROM MemberList WHERE ForumID = forums.ForumID AND UserID = ?) ORDER BY MostRecentActivity DESC`; 

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

//get a user from a username and passworkd
app.get("/user/:UserName-:Password", (req, res) => {
  const sql = `SELECT * FROM Users WHERE UserName = ? AND Password = ?;`; 

  db.query(sql, [req.params.UserName, req.params.Password], (err, result) => {
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

// GET user from user ID
app.get("/user/:userID", (req, res) => {
  const userID = req.userID;

  const SQL = `SELECT * FROM Users WHERE UserID = ?`;

  db.query(SQL, [req.params.userID], (err, results) => {
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
app.get("/userpins/map/:mapID", (req, res) => {
  const { mapID } = req.params;

  const sql = `
    SELECT 
      p.PinID,
      p.UserID,
      p.MapID,
      p.Visibility,
      p.Longitude,
      p.Latitude,
      p.Title,
      p.Description,
      p.LocationID,
      u.UserName
    FROM UserPins p
    INNER JOIN Users u ON p.UserID = u.UserID
    WHERE p.MapID = ?
  `;

  db.query(sql, [mapID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch pins" });
    }

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

// Get map for each forum
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

// GET user pins for each map
app.get("/userpins/map/:mapID", (req, res) => {
  const { mapID } = req.params;

  const sql = `
    SELECT 
      p.PinID,
      p.UserID,
      p.MapID,
      p.Visibility,
      p.Longitude,
      p.Latitude,
      p.Title,
      p.Description,
      u.UserName
    FROM UserPins p
    INNER JOIN Users u ON p.UserID = u.UserID
    WHERE p.MapID = ?
  `;

  db.query(sql, [mapID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch pins" });
    }

    res.json(results);
  });
});

// GET relationship between users 
app.get("/relationship/:User1/:User2", (req, res) => {
  const { User1, User2 } = req.params;

  // checking if user x follows user y
  // also checking if user y follows user x
  const sql = `
    SELECT * FROM UserRelationships WHERE
    (FollowingUser = ? AND FollowedUser = ?)
    OR (FollowingUser = ? AND FollowedUser = ?) ;
  `;

  db.query(sql, [User1, User2, User2, User1], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true, result: result});
  });
});

// GET forums from users search query
app.get("/search-forums/:query", (req, res) => {
  const { query } = req.params;

  const sql = `
    SELECT * FROM Forums WHERE concat(ForumName, Tags) LIKE "%${query}%";
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET categories from users search query
app.get("/search-categories/:query", (req, res) => {
  const { query } = req.params;

  const sql = `
    SELECT f.ForumID, f.ForumName, c.CategoryName, c.CategoryDescription, c.MostRecentActivity, f.SearchVisibility 
    FROM Categories c JOIN Forums f ON c.ForumID = f.ForumID 
    WHERE concat(CategoryName, CategoryDescription) LIKE "%${query}%";
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET threads form user search query
app.get("/search-threads/:query", (req, res) => {
  const { query } = req.params;

  const sql = `
    SELECT p.ThreadID, PostID, ThreadName, Content, CategoryName, ForumName
    FROM Posts p 
    JOIN Threads t ON p.ThreadID = t.ThreadID 
    JOIN Categories c ON t.CategoryID = c.CategoryID
    JOIN Forums f ON c.ForumID = f.ForumID
    WHERE concat(ThreadName, Content) LIKE "%${query}%" AND OriginalThreadPost = 1;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET all messages conversations a users has (only gets one per converstation)
app.get("/messages/:UserID", (req, res) => {
  const { UserID } = req.params;

  // needs to be fixed since if a = sender b = receiver, b = sender a = receiver is returned as well
  // i have an idea on how to fix it, the issue is that in the main methods the "lowest" value is dropped, but
  // we want to drop the row the corresponds to the oldest time
  const sql = `
              Select m.*, s.UserName AS Sender, s.ProfilePicture AS SenderProfile, 
              r.UserName AS Receiver, r.ProfilePicture AS ReceiverProfile
              From Messages m INNER JOIN Users s ON m.SenderID = s.UserID
              INNER JOIN Users r ON m.ReceiverID = r.UserID
              WHERE (SenderID = ?) OR (ReceiverID = ?) 
              GROUP BY LEAST(SenderID, ReceiverID), GREATEST(SenderID, ReceiverID)
            `;

  db.query(sql, [UserID, UserID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET posts from users search query
app.get("/search-posts/:query", (req, res) => {
  const { query } = req.params;

  const sql = `
    SELECT p.ThreadID, PostID, ThreadName, Content, CategoryName, ForumName
    FROM Posts p 
    JOIN Threads t ON p.ThreadID = t.ThreadID 
    JOIN Categories c ON t.CategoryID = c.CategoryID
    JOIN Forums f ON c.ForumID = f.ForumID
    WHERE concat(ThreadName, Content) LIKE "%${query}%" AND OriginalThreadPost = 0;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET users from users search query
app.get("/search-users/:query", (req, res) => {
  const { query } = req.params;

  const sql = `
    SELECT * FROM Users WHERE UserName LIKE "%${query}%";
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search data" });
    }

    res.json(result);
  });
});

// GET road status updates from MDOT
app.get("/road-status/:forumID", async (req, res) => {
  try {
    const apiKey = process.env.MDOT_API_KEY;

    if (!apiKey) {
      console.error("MDOT_API_KEY is missing from .env");
      return res.status(500).json({ error: "MDOT_API_KEY is missing" });
    }

    const url =
      "https://mdotridedata.state.mi.us/api/v1/organization/michigan_department_of_transportation/dataset/incidents/query?limit=200&_format=json";

    const response = await fetch(url, {
      headers: {
        api_key: apiKey,
        Accept: "application/json",
      },
    });

    const rawText = await response.text();

    console.log("MDOT status:", response.status, response.statusText);
    console.log("MDOT raw response preview:", rawText.slice(0, 1000));

    if (!response.ok) {
      return res.status(500).json({
        error: "MDOT request failed",
        status: response.status,
        statusText: response.statusText,
        bodyPreview: rawText.slice(0, 500),
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse MDOT JSON:", parseError);
      return res.status(500).json({
        error: "MDOT returned non-JSON data",
        bodyPreview: rawText.slice(0, 500),
      });
    }

    const roadStatuses = data
      .map((item, index) => {
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        const description = item.description || item["location-desc"] || "No details";
        const lowered = description.toLowerCase();

        let type = "construction";

        if (lowered.includes("closed") || lowered.includes("closure")) {
          type = "closed";
        } else if (
          lowered.includes("crash") ||
          lowered.includes("accident") ||
          lowered.includes("incident")
        ) {
          type = "incident";
        }

        return {
          id: item["closure-id"] || item["job-id"] || index,
          type,
          title: item.roadway || "Road Event",
          description,
          iconPosition: { lat, lng },
          path: [
            { lat, lng },
          ]
        };
      })
      .filter(Boolean);

    res.json(roadStatuses);
  } catch (error) {
    console.error("Failed to load MDOT data:", error);
    res.status(500).json({ error: "Failed to load MDOT data" });
  }
});
// GET if road statuses are included in the map
app.get("/maps/:mapID/include-status", (req, res) => {
  const mapID = req.params.mapID;

  const sql = `
    SELECT IncludeStatus
    FROM Maps
    WHERE MapID = ?
  `;

  db.query(sql, [mapID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch include status" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Map not found" });
    }

    const includeStatus = results[0].IncludeStatus;

    res.json({
      mapID,
      includeStatus: Number(includeStatus) === 1
    });
  });
});

// GET if the legend is included in the map
app.get("/map-legend/:forumID", (req, res) => {
  const forumID = req.params.forumID.trim();

  const sql = `
    SELECT IncludeLegend
    FROM Maps
    WHERE ForumID = ?
    LIMIT 1
  `;

  db.query(sql, [forumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch legend setting" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Map not found for forum" });
    }

    res.json({
      includeLegend: result[0].IncludeLegend === 1
    });
  });
});

// GET reviews for each location
app.get("/place-reviews/:locationID", (req, res) => {
  const { locationID } = req.params;

  const sql = `
    SELECT r.*, u.UserName
    FROM PlaceReviews r
    JOIN Users u ON r.UserID = u.UserID
    WHERE r.LocationID = ?
    ORDER BY r.UpdatedAt DESC
  `;

  db.query(sql, [locationID], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET review summary for each location
app.get("/place-reviews/:locationID/summary", (req, res) => {
  const { locationID } = req.params;

  const sql = `
    SELECT COUNT(*) AS count, ROUND(AVG(Rating), 1) AS avg
    FROM PlaceReviews
    WHERE LocationID = ?
  `;

  db.query(sql, [locationID], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

const cleanTags = (tags) => { // splits into an array and removes duplicates, white spaces, and ', ", `, then forms a string with elements seperated by a single comma
    let tagArray = tags.split(",");
    let tagSet = new Set(); // prevents duplicates

    for (const tag of tagArray) {
        let trimmedTag = tag.trim();

        if (trimmedTag != "" && !tag.includes("\"") && !tag.includes("\'") && !tag.includes("\`") && !tag.includes(",")) {
            tagSet.add(trimmedTag);
        }
    }

    return Array.from(tagSet).join(",");
}

// POST Endpoints
// POST forums
app.post("/forums", (req, res) => {
    const { ForumName, SearchVisibility, JoinPermissions, AllowMaps, UserID, Tags } = req.body; // add in tags later the form currently doesnt support them

    let tags = cleanTags(Tags);

    // query to insert forum 
    const sql = `
        INSERT INTO Forums (ForumName, SearchVisibility, JoinPermissions, AllowMaps, OwnerID, Tags)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [ForumName, SearchVisibility, JoinPermissions, AllowMaps, UserID, tags], (err, result) => {
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

// Follow a user
app.post("/follow", (req, res) => {
  const { FollowerID, FolloweeID } = req.body;

  // relationship defaults to following
  const SQL = `INSERT INTO UserRelationships (FollowingUser, FollowedUser)
              VALUES (?, ?);`

  db.query(SQL, [FollowerID, FolloweeID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

// block a use (only for if the user blocking does not have an established relationship with who theyre block)
app.post("/block", (req, res) => {
  const { ReporterID, ReporteeID } = req.body;

  // set relationship to blocked
  // if the blocked follows the blockee- remove the relationship from blocked to blockee
  const SQL =   `
                    INSERT INTO UserRelationships (FollowingUser, FollowedUser, Relationship)
                    VALUES (${ReporterID}, ${ReporteeID}, "Blocked");
                                    
                    DELETE FROM UserRelationships 
                    WHERE (FollowingUser = ${ReporteeID} AND FollowedUser = ${ReporterID}) AND
                    (Relationship = "Friends" OR Relationship = "Following");
                `

  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

app.post("/friend", (req, res) => {
  const { FollowerID, FolloweeID } = req.body;

  // if the user is following someone that follows them
  // update the relationship status for both users
  const SQL = `INSERT INTO UserRelationships (FollowingUser, FollowedUser, Relationship)
               VALUES (?, ?, "Friends");
               
               UPDATE UserRelationships
               SET Relationship = "Friends"
               WHERE FollowingUser = ? AND FollowedUser = ?` 

  db.query(SQL, [FollowerID, FolloweeID, FolloweeID, FollowerID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

// POST threads
app.post("/create-thread", (req, res) => {
  const { ThreadName, Content, UserID, CategoryID } = req.body;

  const sql = `
    INSERT INTO Threads (ThreadName, CategoryID, CreatorID)
    VALUES (?, ?, ?);

    SELECT LAST_INSERT_ID() INTO @created_thread;

    INSERT INTO Posts (ThreadID, UserID, Content, OriginalThreadPost)
    VALUES (@created_thread, ?, ?, 1);
  `;

  db.query(sql, [ThreadName, CategoryID, UserID, UserID, Content], (err, result) => {
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
    INSERT INTO Categories (CategoryName, CategoryDescription, Pinned, ForumID)
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
  const {
    user_id,
    map_id,
    visibility,
    longitude,
    latitude,
    title,
    description
  } = req.body;

  // Create Location
  const locationSql = `
    INSERT INTO Locations (LocationName, Latitude, Longitude)
    VALUES (?, ?, ?)
  `;

  db.query(locationSql, [title, latitude, longitude], (err, locationResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create location" });
    }

    const locationID = locationResult.insertId;

    // Create Pin with LocationID
    const pinSql = `
      INSERT INTO UserPins (UserID, MapID, Visibility, Longitude, Latitude, Title, Description, LocationID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      pinSql,
      [user_id, map_id, visibility, longitude, latitude, title, description, locationID],
      (err, pinResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to create pin" });
        }

        res.json({
          message: "Pin and location created",
          pinID: pinResult.insertId,
          locationID: locationID
        });
      }
    );
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

app.post("/reply", (req, res) => {
  const { creator, thread_id, content, subject } = req.body;

  // query for posting likes
  const sql = ` 
    INSERT INTO Posts (UserID, ThreadID, Content, Subject)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [creator, thread_id, content, subject], (err, result) => {
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
  const { Subject, SubmitterID } = req.body;

  // query for posting reports
  // **Currently does not allow for a duplicate forumID**
  const sql = ` 
    INSERT INTO BugReports (Subject, SubmitterID)
    VALUES (?, ?)
  `;

  db.query(sql, [Subject, SubmitterID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create report" });
    }

    res.json({ message: "report created", id: result.insertId });
  });
});

// POST content report
app.post("/content-reports", (req, res) => {
  const { ReportType, Subject, SubmitterID, ReportedID } = req.body;

  // query for posting reports
  const sql = ` 
    INSERT INTO Reports (ReportType, Subject, SubmitterID, ReportedID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [ReportType, Subject, SubmitterID, ReportedID], (err, result) => {
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

// POST user
app.post("/create-user", (req, res) => {
  const { UserName, Email, Password } = req.body;

  // query for posting users
  const sql = ` 
    INSERT INTO Users (UserName, Email, Password)
    VALUES (?, ?, ?);

    SELECT LAST_INSERT_ID() INTO @new_user_ID;
    SELECT * FROM Users WHERE UserID = @new_user_ID;
  `;

  db.query(sql, [UserName, Email, Password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create user" });
    }

    res.json(result);
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

// POST reviews made by users
app.post("/place-reviews", (req, res) => {
  const { LocationID, UserID, Rating, ReviewText } = req.body;

  if (!LocationID || !UserID || !Rating) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO PlaceReviews (LocationID, UserID, Rating, ReviewText)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      Rating = VALUES(Rating),
      ReviewText = VALUES(ReviewText)
  `;

  db.query(sql, [LocationID, UserID, Rating, ReviewText], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Review saved" });
  });
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

// unblock
app.delete("/unblock", (req, res) => {
  const { ReporterID, ReporteeID } = req.body;

  // remove blocked relationship
  const SQL =   `
                    DELETE FROM UserRelationships 
                    WHERE (FollowingUser = ${ReporterID} AND FollowedUser = ${ReporteeID});
                `

  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
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
  const pinID = req.params.id.trim();
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: "userID is required" });
  }

  const sql = `DELETE FROM UserPins WHERE PinID = ? AND UserID = ?`;

  db.query(sql, [pinID, userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete pin" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "You can only delete your own pins" });
    }

    res.json({ message: "User pin deleted" });
  });
});

// Unfollow a user
app.post("/unfollow", (req, res) => {
  const { FollowerID, FolloweeID } = req.body;

  const SQL = `DELETE FROM UserRelationships
               WHERE FollowingUser = ? AND FollowedUser = ?`

  db.query(SQL, [FollowerID, FolloweeID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

// unfollow a friend
app.post("/unfriend", (req, res) => {
  const { FollowerID, FolloweeID } = req.body;

  // if the user is unfollowing someone that follows them
  // update the relationship status for both users
  const SQL = `DELETE FROM UserRelationships
               WHERE FollowingUser = ? AND FollowedUser = ?;
               
               UPDATE UserRelationships
               SET Relationship = "Following"
               WHERE FollowingUser = ? AND FollowedUser = ?` 

  db.query(SQL, [FollowerID, FolloweeID, FolloweeID, FollowerID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
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

app.put("/update-tags", (req, res) => {
  const { ForumID, ForumTags } = req.body;

  let tags = cleanTags(ForumTags);

  const sql = `
    UPDATE Forums
    SET Tags = "${tags}"
    WHERE ForumID = ${ForumID}
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update tags" });
    }

    res.json({ message: "tags updated" });
  });
});

// update relationship to blocked
app.put("/block-friend", (req, res) => {
  const { ReporterID, ReporteeID } = req.body;

  // set relationship to blocked
  // if the blocked follows the blockee- remove the relationship from blocked to blockee
  const SQL =   `
                    UPDATE UserRelationships 
                    SET Relationship = "Blocked"
                    WHERE (FollowingUser = ${ReporterID} AND FollowedUser = ${ReporteeID})
                                    
                    DELETE FROM UserRelationships 
                    WHERE (FollowingUser = ${ReporteeID} AND FollowedUser = ${ReporterID}) AND
                    (Relationship = "Friends" OR Relationship = "Following");
                `

  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

// update the link to the users profile image
app.put("/user-image", (req, res) => {
  const { UserID, ProfilePicture } = req.body;

  const sql = `
    UPDATE Users
    SET ProfilePicture = ?
    WHERE UserID = ?
  `;

  db.query(sql, [ProfilePicture, UserID], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({successful: false, error: err});
    }

    return res.json({successful: true});
  });
});

// update forum settings
app.put("/update-forums", (req, res) => {
  const postID = req.params.id;
  const { ForumID, SearchVisibility, JoinPermissions, AllowMaps } = req.body;

  const sql = `
    UPDATE Forums
    SET SearchVisibility = ?, JoinPermissions = ?, AllowMaps = ?
    WHERE ForumID = ?
  `;

  db.query(sql, [SearchVisibility, JoinPermissions, AllowMaps, ForumID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update forums" });
    }

    res.json({ message: "Forum updated" });
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
    "Role",
    "ProfilePicture"
  ];

  const allowedAvatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
    "avatar7.png",
    "avatar8.png",
    "avatar9.png",
    "avatar10.png"
  ];

  const updates = [];
  const values = [];

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      if (key === "ProfilePicture") {
        if (!allowedAvatars.includes(req.body[key])) {
          return res.status(400).json({ message: "Invalid avatar selection" });
        }
      }

      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No valid fields provided" });
  }

  values.push(id);

  const sql = `
    UPDATE Users
    SET ${updates.join(", ")}
    WHERE UserID = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (result.changedRows === 0) {
      return res.json({ message: "No changes made" });
    }

    res.json({ message: "User updated successfully" });
  });
});

// PATCH UserPins
app.patch("/userpins/:id", (req, res) => {
  const pinID = req.params.id.trim();
  const { userID, title, description, visibility } = req.body;

  if (!userID) {
    return res.status(400).json({ message: "userID is required" });
  }

  const sql = `
    UPDATE UserPins
    SET Title = ?, Description = ?, Visibility = ?
    WHERE PinID = ? AND UserID = ?
  `;

  db.query(
    sql,
    [title, description, visibility, pinID, userID],
    (err, result) => {
      if (err) {
        console.error("Error updating pin:", err);
        return res.status(500).json({ error: "Failed to update pin" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Pin not found or user not authorized",
        });
      }

      res.json({ message: "Pin updated successfully" });
    }
  );
});