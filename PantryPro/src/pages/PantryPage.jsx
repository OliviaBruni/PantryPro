import { useState } from "react";
import IngredientList from "../components/IngredientList";

const PantryPage = ({ onNavigate }) => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input)) {
      setIngredients([...ingredients, input]);
    }
    setInput("");
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  return (
    <div>
      <h2>Manage Your Pantry</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ingredient..."
      />
      <button type="button" onClick={addIngredient}>
        Add
      </button>
      <IngredientList ingredients={ingredients} onRemove={removeIngredient} />
      <button type="button" onClick={onNavigate}>
        Find Recipes
      </button>
    </div>
  );
};

export default PantryPage;
