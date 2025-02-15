import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { API_KEY, API_BASE_URL } from "../config";

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/random?apiKey=${API_KEY}&number=4`
      );
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

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
    <div>
      <h1>Random Recipes</h1>
      <button
        className="downloadButton"
        onClick={fetchRecipes}
        disabled={loading}
      >
        {loading ? "Loading..." : "Reload Recipes"}
      </button>

      {recipes.length === 0 ? (
        <p>Loading recipes...</p>
      ) : (
        <Accordion defaultActiveKey="0">
          {recipes.map((someRecipe, index) => (
            <Accordion.Item eventKey={index.toString()} key={someRecipe.id}>
              <Accordion.Header>{someRecipe.title}</Accordion.Header>
              <Accordion.Body className="accordion-content">
                <img
                  src={someRecipe.image}
                  alt={someRecipe.title}
                  width="200"
                />
                <div>
                  <h3>Ingredients:</h3>
                  <ul>
                    {someRecipe.extendedIngredients?.map((someIngredients) => (
                      <li key={someIngredients.id}>
                        {someIngredients.original}
                      </li>
                    ))}
                  </ul>
                  <h3>Instructions:</h3>
                  <p>
                    {someRecipe.instructions || "No instructions available."}
                  </p>
                  <button
                    className="downloadButton"
                    onClick={() => downloadRecipe(someRecipe)}
                  >
                    Download Recipe
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default RecipeSuggestions;
