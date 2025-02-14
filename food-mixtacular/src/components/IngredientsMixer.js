import React, { useState } from "react";
import "normalize.css";
import "../styles/main.scss";
import { API_KEY, API_BASE_URL } from "../config";

const App = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSpices, setSelectedSpices] = useState([]);

  // Ingredients and spices variables
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

  // The famous downlaod button
  const downloadRecipe = (recipe) => {
    const recipeText = `Recipe: ${recipe.title}
    
    Ingredients:
    ${
      recipe.missedIngredients?.map((ing) => `- ${ing.original}`).join("\n") ||
      "No ingredients details available."
    }

    Instructions:
    ${
      recipe.analyzedInstructions?.[0]?.steps
        ?.map((step, index) => `${step.step}`)
        .join("\n") || "No instructions available."
    }`;

    const blob = new Blob([recipeText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${recipe.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // fetch recipe api
  const fetchRecipes = async () => {
    const allSelectedItems = [...selectedIngredients, ...selectedSpices];

    if (allSelectedItems.length > 0) {
      const ingredientsParam = allSelectedItems.join(",");
      const API_URL = `${API_BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientsParam}&number=5`;

      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    }
  };

  // Checkboxes handling

  // Ingredients
  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  // Spices
  const handleSpiceChange = (spice) => {
    setSelectedSpices((prevSelected) =>
      prevSelected.includes(spice)
        ? prevSelected.filter((item) => item !== spice)
        : [...prevSelected, spice]
    );
  };

  // Clearing ingredients/spices checkboxes
  const clearSelection = () => {
    setSelectedIngredients([]);
    setSelectedSpices([]);
  };

  // Fetch recipe details
  const handleRecipeDetails = async (recipe) => {
    try {
      const recipeDetailsResponse = await fetch(
        `${API_BASE_URL}/${recipe.id}/information?apiKey=${API_KEY}`
      );
      const recipeDetails = await recipeDetailsResponse.json();
      setSelectedRecipe(recipeDetails);
    } catch (error) {
      console.error("Error fetching the recipe details", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="mixer">
        <section className="ingredients-area">
          <h1>Ingredients mixer Selection</h1>
          <div className="ingredients-selection">
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
        </section>

        <section className="spices-area">
          <h2>Spices Selection</h2>
          <div className="spices-selection">
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
        </section>

        <button onClick={fetchRecipes}>Search Recipes</button>
        <button onClick={clearSelection}>Reset ingredients</button>
      </div>

      <section className="display-recipe-result">
        <h1>Recipe Results</h1>
        <section>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <img src={recipe.image} alt={recipe.title} width="300" />
              <h3>{recipe.title}</h3>
              <button onClick={() => handleRecipeDetails(recipe)}>
                View Recipe
              </button>
              <button onClick={() => downloadRecipe(recipe)}>
                Download Recipe
              </button>{" "}
            </div>
          ))}
        </section>
      </section>

      {selectedRecipe && (
        <div>
          <h1>Cooking Recipe</h1>
          <h2>{selectedRecipe.title}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {selectedRecipe.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
          <h3>Cooking Instructions:</h3>
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
