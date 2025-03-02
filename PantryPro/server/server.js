require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

const BASE_URL = "https://api.spoonacular.com";

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/recipes", async (req, res) => {
  const { ingredients } = req.ingredients;

  if (!ingredients) {
    return res.status(400).json({ message: "Missing search query" });
  }
  try {
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        ingredients,
        apiKey: process.env.API_KEY,
        number: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recipe", error: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
