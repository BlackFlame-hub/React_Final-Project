import React, { useState, useEffect } from "react";

// Assuming API_KEY is set properly via .env
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Get the list of ingredients from Spoonacular API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/ingredients?apiKey=${API_KEY}`
        );
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  // Fetch recipes based on selected ingredients
  const fetchRecipes = async () => {
    if (selectedIngredients.length > 0) {
      const ingredientsParam = selectedIngredients.join(",");
      const API_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientsParam}&number=5`;
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  };

  // Handle ingredient checkbox selection
  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  // Handle recipe image click to display recipe details
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div>
      <div>
        <h1>Ingredients Mixer</h1>
        <div>
          {ingredients.map((ingredient) => (
            <label key={ingredient.id}>
              <input
                type="checkbox"
                value={ingredient.name}
                onChange={() => handleIngredientChange(ingredient.name)}
              />
              {ingredient.name}
            </label>
          ))}
        </div>
        <button onClick={fetchRecipes}>Search Recipes</button>
      </div>

      <div>
        <h1>Results</h1>
        <div>
          {recipes.map((recipe) => (
            <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
              <img src={recipe.image} alt={recipe.title} width="100" />
            </div>
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <div>
          <h1>Suggestions</h1>
          <h2>{selectedRecipe.title}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {selectedRecipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ol>
            {selectedRecipe.analyzedInstructions[0]?.steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default App;
