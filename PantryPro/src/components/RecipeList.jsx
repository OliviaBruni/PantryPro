import PropTypes from "prop-types";

const RecipeList = ({ recipes }) => (
  <ul>
    {recipes.map((recipe) => (
      <li key={recipe.title}>
        <strong>{recipe.title}</strong>
        <br />
        <img src={recipe.image} alt={recipe.title} width="150" />
      </li>
    ))}
  </ul>
);

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default RecipeList;
