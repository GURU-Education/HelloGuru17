// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB Atlas
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define Schema
// const wordSchema = new mongoose.Schema({
//   email: String,
//   word: String,
//   counter: { type: Number, default: 1 },
// });

// const Word = mongoose.model("Word", wordSchema, "words");

// // Function to sanitize words
// function sanitizeWord(word) {
//   if (!word) return null;

//   // Convert to lowercase, remove non-alphabetic characters (except apostrophes for contractions like "don't")
//   let sanitized = word.toLowerCase().replace(/[^a-z']/g, "");

//   // Ensure the word still has valid characters (not empty after cleaning)
//   return sanitized.length > 0 ? sanitized : null;
// }


// // API to store word clicks
// app.post("/api/click", async (req, res) => {
//   let { email, word } = req.body;

//   if (!email || !word) {
//     return res.status(400).json({ success: false, message: "Missing email or word" });
//   }

//   // Sanitize the word
//   word = sanitizeWord(word);

//   // If the word is invalid (e.g., just numbers/symbols), ignore it
//   if (!word) {
//     return res.status(400).json({ success: false, message: "Invalid word" });
//   }

//   try {
//     const click = await Word.findOneAndUpdate(
//       { email, word },
//       { $inc: { counter: 1 } },
//       { upsert: true, new: true }
//     );
//     res.json({ success: true, click });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // API to get word click counts per user
// app.get("/api/stats/:email", async (req, res) => {
//   try {
//     const words = await Word.find({ email: req.params.email });
//     res.json(words);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Start server
// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Import UUID for session IDs

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const wordSchema = new mongoose.Schema({
  email: String,
  word: String,
  counter: { type: Number, default: 1 },
  sessionId: String, // Add sessionId field
});

const Word = mongoose.model("Word", wordSchema, "words");

// Function to sanitize words
function sanitizeWord(word) {
  if (!word) return null;

  // Convert to lowercase, remove non-alphabetic characters (except apostrophes for contractions like "don't")
  let sanitized = word.toLowerCase().replace(/[^a-z']/g, "");

  // Ensure the word still has valid characters (not empty after cleaning)
  return sanitized.length > 0 ? sanitized : null;
}

let activeSessions = {}; // Store active sessions in memory

// Start a new session
app.post("/api/start-session", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const sessionId = uuidv4(); // Generate a unique session ID
  activeSessions[email] = sessionId;

  res.json({ success: true, sessionId });
});

// End session
app.post("/api/end-session", (req, res) => {
  const { email } = req.body;
  if (!email || !activeSessions[email]) {
    return res.status(400).json({ success: false, message: "No active session for this email" });
  }

  delete activeSessions[email]; // Remove session from memory
  res.json({ success: true, message: "Session ended" });
});

// API to store word clicks (only if session is active)
app.post("/api/click", async (req, res) => {
  let { email, word } = req.body;

  if (!email || !word) {
    return res.status(400).json({ success: false, message: "Missing email or word" });
  }

  if (!activeSessions[email]) {
    return res.status(400).json({ success: false, message: "Session not started" });
  }

  word = sanitizeWord(word);
  if (!word) {
    return res.status(400).json({ success: false, message: "Invalid word" });
  }

  try {
    const sessionId = activeSessions[email];

    const click = await Word.findOneAndUpdate(
      { email, word, sessionId },
      { $inc: { counter: 1 } },
      { upsert: true, new: true }
    );

    res.json({ success: true, click });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to get word click counts per user
app.get("/api/stats/:email", async (req, res) => {
  try {
    const words = await Word.find({ email: req.params.email });
    res.json(words);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
