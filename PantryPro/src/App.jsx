import { useState, useEffect, use } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "./App.css";
import axios from "axios";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();
        await fetch("http://localhost:8080/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: currentUser.displayName,
            email: currentUser.email,
          }),
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      const token = await result.user.getIdToken();
      await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setPage("landing");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const fetchProtectedData = async () => {
    if (!user) return;
    const token = await user.getIdToken();

    const response = await fetch("http://localhost:8080/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log(data);
  };

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
      <h1>PantryPro</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}

      {/* Navigation Buttons */}
      {page === "landing" && (
        <div>
          <h2>Welcome to PantryPro</h2>
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
          <button onClick={fetchRecipes}>Find Recipes</button>
        </div>
      )}

      {page === "recipes" && (
        <div>
          <h2>Generated Recipes</h2>
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
