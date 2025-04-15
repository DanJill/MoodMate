const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI MoodMate Backend is Running!");
});

// ✅ Mood detection route
app.post("/detect-mood", async (req, res) => {
  const { message } = req.body;

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
          content: message
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`
      }
    }
  );

  res.json({ message: response.data.choices[0].message.content });
});


  } catch (error) {
    console.error("Error calling OpenAI:", error.message);
    res.status(500).json({ error: "Failed to detect mood" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
