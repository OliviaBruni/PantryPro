import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to PantryPro</h1>
      <h2>The best way to manage your kitchen</h2>
      <button onClick={() => navigate("/pantry")}>Go to Pantry</button>
      <button onClick={() => navigate("/recipes")}>View Recipes</button>
    </div>
  );
};

LandingPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LandingPage;
