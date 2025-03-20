import { useState, useEffect } from "react";
import axios from "axios";
import IngredientList from "../components/IngredientList";

const PantryPage = ({ user }) => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [expDate, setExpDate] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      try {
        const response = await axios.get("http://localhost:8080/kitchen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIngredients(response.data);
      } catch (error) {
        console.error("Failed to fetch pantry items:", error);
      }
    };
    fetchIngredients();
  }, [user]);

  const addIngredient = async () => {
    if (!user) return;
    const token = await user.getIdToken();

    // Ensure expDate is not null
    if (!expDate) {
      console.error("Expiration date is required");
      return;
    }

    const ingredientData = {
      ingredient: input.trim(), // Trim spaces
      amount,
      unit,
      expDate, // Should now be correctly populated
    };

    console.log("Sending ingredient data:", ingredientData);

    try {
      const response = await axios.post(
        "http://localhost:8080/kitchen/add",
        ingredientData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Ingredient added:", response.data);
      fetchIngredients(); // Refresh UI after adding
    } catch (error) {
      console.error("Error adding ingredient:", error.response?.data || error);
    }
  };

  const removeIngredient = async (ingredientId) => {
    if (!user) return;
    const token = await user.getIdToken();

    try {
      await axios.delete(
        `http://localhost:8080/kitchen/remove/${ingredientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIngredients(ingredients.filter((item) => item.id !== ingredientId));
    } catch (error) {
      console.error(
        "Error removing ingredient:",
        error.response?.data || error
      );
    }
  };

  return (
    <div>
      <h2>Manage Your Pantry</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ingredient"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="Unit"
      />
      <input
        type="date"
        value={expDate}
        onChange={(e) => setExpDate(e.target.value)}
      />
      <button type="button" onClick={addIngredient}>
        Add
      </button>

      <IngredientList ingredients={ingredients} onRemove={removeIngredient} />
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {ingredient.amount} {ingredient.unit} (Expires:{" "}
            {ingredient.expDate})
            <button onClick={() => removeIngredient(ingredient.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PantryPage;
