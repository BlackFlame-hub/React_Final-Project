import React, { useState } from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import { API_KEY, API_BASE_URL } from "../config";

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/complexSearch?query=${encodeURIComponent(
          query
        )}&number=4&addRecipeInformation=true&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        console.error("Error response:", await response.text());
        setRecipes([]);
        setLoading(false);
        return;
      }
      const data = await response.json();
      // console.log("Fetch boy!", data.results);
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    }
    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${id}/information?apiKey=${API_KEY}`
      );
      if (!response.ok) {
        console.error("Error fetching recipe details:", await response.text());
        return;
      }
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const getInstructions = (recipe) => {
    if (recipe.instructions && recipe.instructions.trim() !== "") {
      return recipe.instructions;
    } else if (
      recipe.analyzedInstructions &&
      recipe.analyzedInstructions.length > 0 &&
      recipe.analyzedInstructions[0].steps &&
      recipe.analyzedInstructions[0].steps.length > 0
    ) {
      return recipe.analyzedInstructions[0].steps
        .map((step) => step.step)
        .join(" | ");
    }
    return "No instructions available.";
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
    <div className="container mt-4">
      <h2>Search for Recipes</h2>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          fetchRecipes();
        }}
      >
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Enter a dish name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" variant="primary" type="submit">
          Search
        </Button>
      </Form>

      {loading && <p>Loading recipes...</p>}

      {recipes.length > 0 && (
        <Accordion defaultActiveKey="0" className="mt-4">
          {recipes.map((recipe) => (
            <Accordion.Item eventKey={recipe.id.toString()} key={recipe.id}>
              <Accordion.Header onClick={() => fetchRecipeDetails(recipe.id)}>
                {recipe.title}
              </Accordion.Header>
              <Accordion.Body className="accordion-content">
                <img src={recipe.image} alt={recipe.title} className="mb-3" />
                <div>
                  {selectedRecipe && selectedRecipe.id === recipe.id ? (
                    <>
                      <h3>Ingredients:</h3>
                      {selectedRecipe.extendedIngredients &&
                      selectedRecipe.extendedIngredients.length > 0 ? (
                        <ul>
                          {selectedRecipe.extendedIngredients.map(
                            (ingredient, index) => (
                              <li key={`${ingredient.id}-${index}`}>
                                {ingredient.original}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>No ingredients available.</p>
                      )}

                      <h3>Instructions:</h3>
                      <p>{getInstructions(selectedRecipe)}</p>
                    </>
                  ) : (
                    <p>Click to load details...</p>
                  )}
                  <button
                    className="downloadButton"
                    onClick={() => downloadRecipe(selectedRecipe)}
                  >
                    Download Recipe
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {recipes.length === 0 && !loading && (
        <p>No results found. Please try a different search.</p>
      )}
    </div>
  );
};

export default RecipeSearch;
