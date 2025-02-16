import React, { useState } from "react";
import "normalize.css";
import "../styles/main.scss";
import { API_KEY, API_BASE_URL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";

const IngredientsMixer = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedSpices, setSelectedSpices] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const ingredients = [
    "Bacon",
    "Beef",
    "Butter",
    "Carrot",
    "Cheese",
    "Chicken",
    "Egg",
    "Garlic",
    "Lettuce",
    "Milk",
    "Mushroom",
    "Olive oil",
    "Onion",
    "Pasta",
    "Peppers",
    "Potato",
    "Rice",
    "Salmon",
    "Shrimp",
    "Spinach",
    "Tomato",
    "Yogurt",
  ];
  const spices = [
    "Basil",
    "Black pepper",
    "Cinnamon",
    "Coriander",
    "Cumin",
    "Oregano",
    "Paprika",
    "Parsley",
    "Salt",
    "Thyme",
  ];

  const fetchRecipes = async () => {
    const allSelectedItems = [...selectedIngredients, ...selectedSpices];
    if (allSelectedItems.length > 0) {
      const ingredientsParam = allSelectedItems.join(",");
      const API_URL = `${API_BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientsParam}&number=4`;
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    }
  };

  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe details", error);
    }
  };

  const downloadRecipe = (recipe) => {
    const recipeText = `Recipe: ${recipe.title}\n\nIngredients:\n${
      recipe.extendedIngredients
        ?.map((ing) => `- ${ing.original}`)
        .join("\n") || "No ingredients details available."
    }\n\nInstructions:\n${
      recipe.analyzedInstructions?.[0]?.steps
        .map((step) => `${step.step}`)
        .join("\n") || "No instructions available."
    }`;

    const blob = new Blob([recipeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wrapper">
      <div className="mixer">
        <section className="ingredients-area">
          <h2>Ingredients Selection</h2>
          <div className="ingredients-selection">
            {ingredients.map((ingredient) => (
              <label key={ingredient}>
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient)}
                  onChange={() =>
                    setSelectedIngredients((prev) =>
                      prev.includes(ingredient)
                        ? prev.filter((item) => item !== ingredient)
                        : [...prev, ingredient]
                    )
                  }
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
                  checked={selectedSpices.includes(spice)}
                  onChange={() =>
                    setSelectedSpices((prev) =>
                      prev.includes(spice)
                        ? prev.filter((item) => item !== spice)
                        : [...prev, spice]
                    )
                  }
                />
                {spice}
              </label>
            ))}
          </div>
        </section>
        <button onClick={fetchRecipes}>Search Recipes</button>
        <button
          onClick={() => {
            setSelectedIngredients([]);
            setSelectedSpices([]);
          }}
        >
          Reset Ingredients
        </button>
      </div>

      <section className="display-recipe-result">
        <h1>Recipe Results:</h1>
        <Accordion>
          {recipes.length === 0 ? (
            <Accordion.Item eventKey="0">
              <Accordion.Header>Search for your recipe first!</Accordion.Header>
              <Accordion.Body>
                Select ingredients and press "Search Recipes".
              </Accordion.Body>
            </Accordion.Item>
          ) : (
            recipes.map((recipe, index) => (
              <Accordion.Item eventKey={String(index)} key={recipe.id}>
                <Accordion.Header onClick={() => fetchRecipeDetails(recipe.id)}>
                  {recipe.title}
                </Accordion.Header>
                <Accordion.Body className="accordion-content">
                  <img src={recipe.image} alt={recipe.title} />
                  {selectedRecipe?.id === recipe.id && (
                    <>
                      <div>
                        <h3>Ingredients:</h3>
                        <ul>
                          {selectedRecipe.extendedIngredients?.map((ing) => (
                            <li key={ing.id}>{ing.original}</li>
                          ))}
                        </ul>
                        <h3>Instructions:</h3>
                        <p>
                          {selectedRecipe.analyzedInstructions?.[0]?.steps
                            ?.map((step) => step.step)
                            .join(" ") || "No instructions available."}
                        </p>
                        <button
                          className="downloadButton"
                          onClick={() => downloadRecipe(selectedRecipe)}
                        >
                          Download Recipe
                        </button>
                      </div>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))
          )}
        </Accordion>
      </section>
    </div>
  );
};

export default IngredientsMixer;
