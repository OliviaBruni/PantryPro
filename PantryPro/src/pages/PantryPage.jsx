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
    if (!input.trim()) return;
    const token = await user.getIdToken();
    try {
      const response = await axios.post(
        "http://localhost:8080/kitchen/add",
        { name: input, amount, unit, expDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIngredients([...ingredients, response.data.ingredient]);

      setInput("");
      setAmount("");
      setUnit("");
      setExpDate("");
    } catch (error) {
      console.error("Failed to add ingredient:", error);
    }
  };

  const removeIngredient = async (id) => {
    const token = await user.getIdToken();

    try {
      await axios.delete(`http://localhost:8080/kitchen/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIngredients(ingredients.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove ingredient:", error);
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

      <IngredientList ingredients={ingredients} />
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
