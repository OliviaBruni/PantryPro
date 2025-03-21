import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { verifyToken } from "./authMiddleware.js";
import { db } from "./firebaseAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const BASE_URL = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;

const Origins = [
  "https://fir-kesmail-453506.web.app",
  "https://pantrypro.onrender.com",
];

app.use(cors({ origin: Origins, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PantryPro Backend is Running!");
});

app.post("/signup", verifyToken, async (req, res) => {
  try {
    const { username, firstName, lastName, email } = req.body;
    const userId = req.user.uid;

    // Save user info to Firestore
    await db.collection("users").doc(userId).set({
      username,
      firstName,
      lastName,
      email,
      createdAt: new Date(),
    });

    // Connect user to Spoonacular
    const spoonacularResponse = await axios.post(
      `${BASE_URL}/users/connect`,
      { username },
      { params: { apiKey: API_KEY } }
    );

    const spoonacularData = spoonacularResponse.data;

    // Store Spoonacular user data in Firestore
    await db.collection("users").doc(userId).update({ spoonacularData });

    res
      .status(200)
      .json({ message: "User signed up & connected!", spoonacularData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to sign up", details: error.message });
  }
});

/**
 * Add Ingredient to User's Kitchen
 */
app.post("/kitchen/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { ingredient, amount, unit, expDate } = req.body;

    if (!userId) {
      console.error("Unauthorized request: No user ID.");
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }
    console.log("Full request body:", req.body);
    console.log("Received data", { ingredient, amount, unit, expDate });

    if (!ingredient || !amount || !unit) {
      console.error("Missing required fields!", {
        ingredient,
        amount,
        unit,
        expDate,
      });
      return res.status(400).json({ error: "Missing ingredient fields" });
    }

    const ingredientRef = db
      .collection("users")
      .doc(userId)
      .collection("kitchen")
      .doc();
    await ingredientRef.set({
      ingredient,
      amount,
      unit,
      expDate,
      id: ingredientRef.id,
    });

    console.log(`Ingredient added for user ${userId}:`, {
      ingredient,
      amount,
      unit,
      expDate,
    });

    res.status(200).json({
      message: "Ingredient added!",
      ingredient: { id: ingredientRef.id, ingredient, amount, unit, expDate },
    });
  } catch (error) {
    res;
    console.error("Firestore Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to add ingredient", details: error.message });
  }
});

/**
 * Remove Ingredient from User's Kitchen
 */
app.delete("/kitchen/remove/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const ingredientId = req.params.id;

    await db
      .collection("users")
      .doc(userId)
      .collection("kitchen")
      .doc(ingredientId)
      .delete();

    res.status(200).json({ message: "Ingredient removed!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to remove ingredient", details: error.message });
  }
});

/**
 * Get User's Kitchen Ingredients
 */
app.get("/kitchen", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("kitchen")
      .get();

    const ingredients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch kitchen ingredients",
      details: error.message,
    });
  }
});

/**
 * Generate Recipes from Ingredients
 */
app.get("/recipes", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Fetch user's ingredients
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("kitchen")
      .get();
    const ingredients = snapshot.docs.map((doc) => doc.data().name).join(",");

    if (!ingredients) {
      return res.status(400).json({ error: "No ingredients found" });
    }

    // Fetch recipes
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        ingredients,
        number: 5,
        apiKey: API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch recipes", details: error.message });
  }
});

/**
 * Generate Meal Plan
 */
app.get("/meal-plan", verifyToken, async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
      params: {
        timeFrame: "week",
        apiKey: API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate meal plan", details: error.message });
  }
});

/**
 * Generate Random Recipes
 */
app.get("/random-recipes", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: { number: 5, apiKey: API_KEY },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch random recipes",
      details: error.message,
    });
  }
});

/**
 * Generate Shopping List from Meal Plan
 */
app.get("/shopping-list", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const mealPlanRef = db
      .collection("users")
      .doc(userId)
      .collection("mealPlan");
    const snapshot = await mealPlanRef.get();

    const ingredients = [];
    snapshot.docs.forEach((doc) => {
      const { extendedIngredients } = doc.data();
      if (extendedIngredients) {
        ingredients.push(...extendedIngredients);
      }
    });

    res.status(200).json({ shoppingList: ingredients });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate shopping list",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
