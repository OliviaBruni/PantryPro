import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogin, onLogout }) => (
  <nav>
    <h1>PantryPro</h1>
    <Link to="/">Home</Link>
    <Link to="/pantry">Pantry</Link>
    <Link to="/recipes">Recipes</Link>

    {user ? (
      <>
        <p>Welcome, {user.displayName}</p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </>
    ) : (
      <button type="button" onClick={onLogin}>
        Login with Google
      </button>
    )}
  </nav>
);

Navbar.propTypes = {
  user: PropTypes.object,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
