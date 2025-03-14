import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { verifyToken } from "./authMiddleware.js";
import { db, auth } from "./firebaseAdmin.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

const BASE_URL = "https://api.spoonacular.com";

app.use(cors(corsOptions));
app.use(express.json());

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.post("/users", verifyToken, async (req, res) => {
  try {
    const { email, name } = req.body;
    await db.collection("users").doc(req.user.uid).set({
      email,
      name,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user data" });
  }
});
app.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.params.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/recipes", async (req, res) => {
  const { ingredients } = req.query;

  if (!ingredients) {
    return res.status(400).json({ message: "Missing search query" });
  }
  try {
    const response = await get(`${BASE_URL}/recipes/findByIngredients`, {
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
