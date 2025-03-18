import PropTypes from "prop-types";

const IngredientList = ({ ingredients, onRemove }) => (
  <ul>
    {ingredients.map((ingredient) => (
      <li key={ingredient}>
        {ingredient}{" "}
        <button type="button" onClick={() => onRemove(ingredient)}>
          Remove
        </button>
      </li>
    ))}
  </ul>
);

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default IngredientList;
