import { useState, useEffect, use } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState("landing");

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input)) {
      setIngredients([...ingredients, input]);
    }
    setInput("");
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const fetchRecipes = async () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/recipes", {
        params: { ingredients: ingredients.join(",") },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {page === "landing" && (
        <div>
          <h1>Welcome to PantryPro</h1>
          <button onClick={() => setPage("pantry")}>Get Started</button>
        </div>
      )}
      {page === "pantry" && (
        <div>
          <h2>Manage Your Pantry</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ingredient..."
          />
          <button onClick={addIngredient}>Add</button>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient}{" "}
                <button onClick={() => removeIngredient(ingredient)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => removeIngredient(ingredient)}>Remove</button>
        </div>
      )}

      {page === "recipes" && (
        <div>
          <h2>Generated Recipes</h2>
          <button onClick={fetchRecipes}>Fetch Recipes</button>
          {loading && <p>Loading...</p>}
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <strong>{recipe.title}</strong>
                <br />
                <img src={recipe.image} alt={recipe.title} width="150" />
              </li>
            ))}
          </ul>
          <button onClick={() => setPage("pantry")}>Back to Pantry</button>
        </div>
      )}
    </div>
  );
}

export default App;
