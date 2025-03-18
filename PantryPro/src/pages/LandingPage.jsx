import PropTypes from "prop-types";

const LandingPage = ({ onNavigate }) => (
  <div>
    <h2>Welcome to PantryPro</h2>
    <button type="button" onClick={onNavigate}>
      Get Started
    </button>
  </div>
);

LandingPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default LandingPage;
