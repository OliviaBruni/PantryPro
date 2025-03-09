const { useState, useEffect } = React;
import axios from "axios";

function LandingPage() {
  // return (
  //   <div className="container">
  //     <h1>Welcome to PantryPro</h1>
  //     <p>
  //       Manage your pantry, add ingredients, and generate recipes based on what
  //       you have!
  //     </p>
  //     <button onClick={() => showPage("pantry")}>Get Started</button>
  //   </div>
  // );
}

function Pantry() {
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

  // return (
  //   <div className="container">
  //     {page === "landing" && (
  //       <div>
  //         <h1>Welcome to PantryPro</h1>
  //         <button onClick={() => setPage("pantry")}>Get Started</button>
  //       </div>
  //     )}
  //     {page === "pantry" && (
  //       <div>
  //         <h2>Manage Your Pantry</h2>
  //       </div>
  //     )}
  //     <input
  //       type="text"
  //       value={input}
  //       onChange={(e) => setInput(e.target.value)}
  //       placeholder="Enter ingredient..."
  //     />
  //     <ul>
  //       {ingredients.map((ingredient, index) => (
  //         <li key={index}>
  //           {ingredient}{" "}
  //           <button onClick={() => removeIngredient(ingredient)}>Remove</button>
  //         </li>
  //       ))}
  //     </ul>
  //     <button onClick={() => showPage("recipes")}>Generate Recipes</button>
  //   </div>
  // );
}

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    setTimeout(() => {
      setRecipes([
        {
          name: "Spaghetti Carbonara",
          ingredients: ["Pasta", "Egg", "Bacon", "Cheese"],
        },
        {
          name: "Vegetable Stir Fry",
          ingredients: ["Broccoli", "Carrot", "Garlic"],
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  // return (
  //   <div className="container">
  //     <h2>Generated Recipes</h2>
  //     <button onClick={fetchRecipes}>Fetch Recipes</button>
  //     {loading && <p>Loading...</p>}
  //     <ul>
  //       {recipes.map((recipe, index) => (
  //         <li key={index}>
  //           <strong>{recipe.name}</strong>: {recipe.ingredients.join(", ")}
  //         </li>
  //       ))}
  //     </ul>
  //     <button onClick={() => showPage("pantry")}>Back to Pantry</button>
  //   </div>
  // );
}

// Function to switch pages
function showPage(page) {
  ReactDOM.render(
    page === "landing" ? (
      <LandingPage />
    ) : page === "pantry" ? (
      <Pantry />
    ) : (
      <Recipes />
    ),
    document.getElementById("root")
  );
}

// Load Landing Page initially
showPage("landing");
