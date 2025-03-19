import PropTypes from "prop-types";

const IngredientList = ({ ingredients = [], onRemove }) => (
  <ul>
    {ingredients.map((ingredient) => (
      <li key={ingredient.id || ingredient}>
        {ingredient.name || ingredient}{" "}
        <button
          type="button"
          onClick={() => onRemove(ingredient.id || ingredient)}
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
);

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
      }),
    ])
  ),
  onRemove: PropTypes.func.isRequired,
};

export default IngredientList;
