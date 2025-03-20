import PropTypes from "prop-types";

const IngredientList = ({ ingredients, onRemove }) => (
  <ul>
    {ingredients.map((ingredientObj) => (
      <li key={ingredientObj.id}>
        {ingredientObj.ingredient} - {ingredientObj.amount} {ingredientObj.unit}
        <button type="button" onClick={() => onRemove(ingredientObj.id)}>
          Remove
        </button>
      </li>
    ))}
  </ul>
);

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      ingredient: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default IngredientList;
