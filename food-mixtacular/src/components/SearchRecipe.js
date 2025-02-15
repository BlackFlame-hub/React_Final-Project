import React, { useState } from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import { API_KEY, API_BASE_URL } from "../config";

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/complexSearch?query=${query}&number=4&addRecipeInformation=true&apiKey=${API_KEY}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setRecipes([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setRecipes(data.results || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Search for Recipes</h2>
      <Form>
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Enter a dish name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" variant="primary" onClick={fetchRecipes}>
          Search
        </Button>
      </Form>
      {loading && <p>Loading recipes...</p>} {/* Loading state message */}
      {recipes.length > 0 && (
        <Accordion defaultActiveKey="0" className="mt-4">
          {recipes.map((searchTheRecipe) => (
            <Accordion.Item
              eventKey={searchTheRecipe.id.toString()}
              key={searchTheRecipe.id}
            >
              <Accordion.Header>{searchTheRecipe.title}</Accordion.Header>
              <Accordion.Body>
                <img
                  src={searchTheRecipe.image}
                  alt={searchTheRecipe.title}
                  width="200"
                />
                <h3>Ingredients:</h3>
                <ul>
                  {searchTheRecipe.extendedIngredients?.map(
                    (searchTheRecipe) => (
                      <li key={searchTheRecipe.id}>
                        {searchTheRecipe.original}
                      </li>
                    )
                  ) || <li>No ingredients available.</li>}
                </ul>
                <h3>Instructions:</h3>
                <p>
                  {searchTheRecipe.instructions || "No instructions available."}
                </p>
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
