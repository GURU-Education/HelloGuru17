require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Import UUID for session IDs

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const wordSchema = new mongoose.Schema({
  email: String,
  word: String,
  counter: { type: Number, default: 1 },
  sessionId: String, // Add sessionId field
});

const Word = mongoose.model("Word", wordSchema, "words");

const flashcardSchema = new mongoose.Schema({
  email: String,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// Function to sanitize words
function sanitizeWord(word) {
  if (!word) return null;

  // Convert to lowercase, remove non-alphabetic characters (except apostrophes for contractions like "don't")
  let sanitized = word.toLowerCase().replace(/[^a-z']/g, "");

  // Ensure the word still has valid characters (not empty after cleaning)
  return sanitized.length > 0 ? sanitized : null;
}

// Function to fetch words clicked in a session
async function getWeakWords(email, sessionId) {
  return await Word.find({ email, sessionId }).sort({ counter: -1 });
}

// Function to save unique flashcards
async function saveFlashcards(email, flashcards) {
  for (const flashcard of flashcards) {
      const exists = await Flashcard.findOne({ email, question: flashcard.question });
      if (!exists) {
          await Flashcard.create({ email, ...flashcard });
      }
  }
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
app.post("/api/end-session", async (req, res) => {
  const { email } = req.body;
  if (!email || !activeSessions[email]) {
    return res.status(400).json({ success: false, message: "No active session for this email" });
  }

  const sessionId = activeSessions[email]; // Get the session ID before deleting it
  delete activeSessions[email]; // Remove session from memory

  try {
    await processSessionEnd(email, sessionId);
    return res.json({ success: true, message: "Session ended and flashcards generated" }); 
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return res.status(500).json({ success: false, message: "Error generating flashcards", error: error.message });
  }
});


async function processSessionEnd(email, sessionId) {
  const weakWords = await getWeakWords(email, sessionId);
  const flashcards = weakWords.map(word => ({
    question: `What does "${word.word}" mean?`,
    answer: `Your answer...`,
  }));

  await saveFlashcards(email, flashcards);
}

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

// API to generate flashcards after session ends
app.post('/generate-flashcards', async (req, res) => {
  const { email, sessionId } = req.body;
  
  if (!email || !sessionId) {
      return res.status(400).json({ error: "Missing email or sessionId" });
  }

  try {
      // Get all words clicked in the session
      const weakWords = await getWeakWords(email, sessionId);
      
      // Generate flashcards for all clicked words
      const flashcards = weakWords.map(word => ({
          question: `What does "${word.word}" mean?`,
          answer: `Your answer...`,
      }));

      // Save only unique flashcards
      await saveFlashcards(email, flashcards);
      res.status(200).json({ message: "Flashcards generated successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
