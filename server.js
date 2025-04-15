const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();  // Fixed the dotenv import

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/detect-mood", async (req, res) => {
  const userInput = req.body.message;  // Changed from req. body.input
  
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a mood-detection assistant. Detect the user's mood from their message and offer a helpful quote, affirmation, or suggestion."
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

    res.json({ message: response.data.choices[0].message.content }); // Changed from 'result' to 'message'
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error details:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

app.listen(PORT, () => {
  console.log(`AI MoodMate backend running on port ${PORT}`);
});
