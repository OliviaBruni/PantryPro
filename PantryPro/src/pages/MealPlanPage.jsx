import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./firebaseConfig";

const MealPlanPage = ({ user }) => {
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMealPlan = async () => {
    setLoading(true);
    const token = await user.getIdToken();
    const response = await axios.get(`${BASE_URL}/meal-plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMealPlan(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMealPlan();
  }, [user]);

  return (
    <div>
      <h2>Meal Plan</h2>
      {loading && <p>Loading...</p>}
      <table>
        <tbody>
          {mealPlan.map((meal, index) => (
            <tr key={index}>
              <td>{meal.title}</td>
              <td>
                <img src={meal.image} alt={meal.title} width="100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanPage;
