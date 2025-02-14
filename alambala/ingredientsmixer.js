import React, { useState, useEffect } from "react";
import "normalize.css";
import "./styles/main.scss";

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const API_URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=5`;

const App = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSpices, setSelectedSpices] = useState([]);

  // Hardcoded list of ingredients for testing
  const ingredients = [
    "bacon",
    "beef",
    "butter",
    "carrot",
    "cheese",
    "chicken",
    "egg",
    "garlic",
    "lettuce",
    "milk",
    "mushroom",
    "olive oil",
    "onion",
    "pasta",
    "peppers",
    "potato",
    "rice",
    "salmon",
    "shrimp",
    "spinach",
    "tomato",
    "yogurt",
  ];

  const spices = [
    "basil",
    "black pepper",
    "cinnamon",
    "coriander",
    "cumin",
    "oregano",
    "paprika",
    "parsley",
    "salt",
    "thyme",
  ];

  const downloadRecipe = (recipe) => {
    const recipeText = `
    Recipe: ${recipe.title}

    Ingredients:
    ${
      recipe.missedIngredients?.map((ing) => `- ${ing.original}`).join("\n") ||
      "No ingredient details available."
    }

    Instructions:
    ${
      recipe.analyzedInstructions?.[0]?.steps
        ?.map((step, index) => `${index + 1}. ${step.step}`)
        .join("\n") || "No instructions available."
    }
    `;

    // Create a Blob with the text content
    const blob = new Blob([recipeText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${recipe.title.replace(/\s+/g, "_")}.txt`; // Filename based on recipe title
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearSelection = () => {
    setSelectedIngredients([]); // Reset ingredients
    setSelectedSpices([]); // Reset spices
  };

  // Fetch recipes based on selected ingredients
  const fetchRecipes = async () => {
    const allSelectedItems = [...selectedIngredients, ...selectedSpices];

    if (allSelectedItems.length > 0) {
      const ingredientsParam = allSelectedItems.join(",");
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

  const handleSpiceChange = (spice) => {
    setSelectedSpices((prevSelected) =>
      prevSelected.includes(spice)
        ? prevSelected.filter((item) => item !== spice)
        : [...prevSelected, spice]
    );
  };

  // Handle recipe image click to display recipe details
  const handleRecipeClick = async (recipe) => {
    try {
      const recipeDetailsResponse = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
      );
      const recipeDetails = await recipeDetailsResponse.json();
      setSelectedRecipe(recipeDetails);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  return (
    <div className="dinamo">
      <div>
        <h1>Ingredients Mixer</h1>
        <div>
          {ingredients.map((ingredient) => (
            <label key={ingredient}>
              <input
                type="checkbox"
                value={ingredient}
                checked={selectedIngredients.includes(ingredient)}
                onChange={() => handleIngredientChange(ingredient)}
              />
              {ingredient}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2>Spices</h2>
        {spices.map((spice) => (
          <label key={spice}>
            <input
              type="checkbox"
              value={spice}
              checked={selectedSpices.includes(spice)}
              onChange={() => handleSpiceChange(spice)}
            />
            {spice}
          </label>
        ))}
      </div>

      <button onClick={fetchRecipes}>Search Recipes</button>
      <button onClick={clearSelection}>Clear Selection</button>

      <div>
        <h1>Results</h1>
        <div>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <img src={recipe.image} alt={recipe.title} width="100" />
              <h3>{recipe.title}</h3>
              <button onClick={() => handleRecipeClick(recipe)}>
                View Details
              </button>
              <button onClick={() => downloadRecipe(recipe)}>
                Download Recipe
              </button>{" "}
            </div>
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <div>
          <h1>Cooking Method</h1>
          <h2>{selectedRecipe.title}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {selectedRecipe.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ol>
            {selectedRecipe.analyzedInstructions?.[0]?.steps?.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default App;
