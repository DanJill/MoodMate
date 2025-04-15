// ai-moodmate-backend/server.js

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('AI MoodMate Backend is Running!');
});


app.post("/analyze", async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a mood-detection assistant. Detect the user's mood from their message and offer a helpful quote, affirmation, or suggestion."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

app.listen(PORT, () => {
  console.log(`AI MoodMate backend running on port ${PORT}`);
});
