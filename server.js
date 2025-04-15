const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
console.log("Received request with input:", userInput);
// and
console.log("OpenAI response:", response.data);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI MoodMate Backend is Running!");
});

// ✅ Mood detection route
app.post("/detect-mood", async (req, res) => {
  const userInput = req.body.message; 

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

try {
  // code that might throw an error
} catch (error) {
  console.error("Error:", error);
  document.getElementById("response").innerText = 
    "Error analyzing mood. Please try again later.";
}
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
