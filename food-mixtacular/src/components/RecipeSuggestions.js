import React, { useState, useEffect } from "react";
import { API_KEY, API_BASE_URL } from "../config";

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    console.log("RecipeSuggestions mounted"); // Debugging

    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/random?apiKey=${API_KEY}&number=5`
        );
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Random Recipes</h1>
      {recipes.length === 0 ? (
        <p>Loading recipes...</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.title}</h2>
              <img src={recipe.image} alt={recipe.title} width="200" />
              <h3>Ingredients:</h3>
              <ul>
                {recipe.extendedIngredients?.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
              <h3>Instructions:</h3>
              <p>{recipe.instructions || "No instructions available."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeSuggestions;
