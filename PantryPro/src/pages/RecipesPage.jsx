import { useState } from "react";
import axios from "axios";
import RecipeList from "../components/RecipeList";

const RecipesPage = ({ onNavigate }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error(new Error("Error fetching recipes:", error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generated Recipes</h2>
      <button type="button" onClick={fetchRecipes}>
        Get Recipes
      </button>
      {loading && <p>Loading...</p>}
      <RecipeList recipes={recipes} />
      <button type="button" onClick={onNavigate}>
        Back to Pantry
      </button>
    </div>
  );
};

export default RecipesPage;
