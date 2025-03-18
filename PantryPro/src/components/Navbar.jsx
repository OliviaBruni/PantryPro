import PropTypes from "prop-types";

const Navbar = ({ user, onLogin, onLogout }) => (
  <nav>
    <h1>PantryPro</h1>
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
