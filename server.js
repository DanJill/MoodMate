const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

app.post("/detect-mood", async (req, res) => {
  const { message } = req.body;
  
  // Validate that we have an API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key");
    return res.status(500).json({ 
      error: "API key not configured", 
      message: "The server is missing its API key configuration. Please contact the administrator."
    });
  }

  try {
    console.log("Analyzing mood for message:", message);
    
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a mood-detection assistant. Detect the user's mood from their message and offer a helpful quote, affirmation, or suggestion. Keep your response concise (2-3 sentences)."
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    console.log("OpenAI API response received");
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    
    // Provide a more specific error message
    let errorMessage = "Failed to analyze mood";
    
    if (error.response?.status === 401) {
      errorMessage = "API authentication error. Please check your API key.";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests to the AI service. Please try again later.";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = "Could not connect to the AI service. Please check your internet connection.";
    }
    
    res.status(500).json({ 
      error: error.message || "Unknown error",
      message: errorMessage
    });
  }
});

// Fallback route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI MoodMate backend running on port ${PORT}`);
  console.log(`OpenAI API key configured: ${process.env.OPENAI_API_KEY ? "Yes" : "No"}`);
});
