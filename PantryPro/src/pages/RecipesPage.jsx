import { useState, useEffect } from "react";
import axios from "axios";
import RecipeList from "../components/RecipeList";

const RecipesPage = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const response = await axios.get("http://localhost:8080/recipes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecipes(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  return (
    <div>
      <h2>Recipes</h2>
      {loading ? <p>Loading...</p> : <RecipeList recipes={recipes} />}
    </div>
  );
};

export default RecipesPage;
