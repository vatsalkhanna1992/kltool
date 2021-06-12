const express = require("express");
const Notes = require("../models/notes");
const auth = require("../middleware/auth");
const router = new express.Router();
const redis = require("redis");

// Fetch notes for the user.
router.get("/notes", auth, async (req, res) => {
  const username = req.user.username;
  const message = req.query.message;
  try {
    const notes = await Notes.find({ username }).sort({
      _id: -1,
    });
    res.render("notes", {
      notes,
      message,
    });
  } catch (e) {
    res.render("notes");
  }
});

// Fetch a note.
router.get("/fetch/note", auth, async (req, res) => {
  //const redis_client = redis.createClient(6379)
  const note_id = req.query.id;
  fetchNotesWithCache(note_id, (note) => {
    if (note) {
      res.send({
        note,
      });
      res.end();
    }
  });
});

// Add a note.
router.post("/add/note", auth, async (req, res) => {
  const username = req.user.username;
  const title = req.body.note_title;
  const description = req.body.note_description;
  try {
    const note = new Notes({ username, title, description });
    await note.save();
    res.send({
      note,
    });
  } catch (e) {
    res.status(400).send({
      error: "Note cannot be added.",
    });
  }
});

// Update a note.
router.patch("/update/note", auth, async (req, res) => {
  const id = req.body.note_id;
  const title = req.body.note_title;
  const description = req.body.note_description;
  try {
    const note = await Notes.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true, runValidators: true }
    );
    res.send({
      note,
    });
  } catch (e) {
    res.status(400).send({
      error: "Note cannot be updated.",
    });
  }
});

// Delete a note.
router.delete("/delete/note", auth, async (req, res) => {
  const id = req.body.id;
  try {
    await Notes.findByIdAndDelete(id);
    res.send({
      message: "Note deleted!",
    });
  } catch (e) {
    res.status(400).send({
      error: "Note cannot be deleted.",
    });
  }
});

// Search notes.
router.get("/search/notes", auth, async (req, res) => {
  const username = req.user.username;
  const searchString = req.query.search_string;
  var notes = "";
  try {
    if (searchString != "") {
      notes = await Notes.find({
        username: username,
        title: {
          $regex: new RegExp(".*" + searchString + ".*", "i"),
        },
      });
    } else {
      notes = await Notes.find({
        username: username,
      });
    }
    return res.send({
      notes,
    });
  } catch (e) {
    res.send({
      error: e,
    });
  }
});

const fetchNotesWithCache = (note_id, callback) => {
  const redis_client = redis.createClient(process.env.REDIS_URL);
  var note = "";
  try {
    redis_client.get(note_id, async (err, note_from_cache) => {
      if (err) {
        callback(null);
      } else if (note_from_cache) {
        callback(JSON.parse(note_from_cache));
      } else {
        note = await Notes.findById(note_id);
        redis_client.setex(
          note_id,
          3600,
          JSON.stringify(note),
          function (err, response) {
            if (err) {
              console.log("Cannot save note into cache.");
            }
          }
        );
        callback(note);
      }
    });
  } catch (e) {
    res.render("notes");
  }
};

module.exports = router;
