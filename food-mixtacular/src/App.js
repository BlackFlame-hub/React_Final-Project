import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/placeholders/Header";
import Footer from "./components/placeholders/Footer";
import IngredientsMixer from "./components/IngredientsMixer";
import RecipeSuggestions from "./components/RecipeSuggestions";
import SearchRecipe from "./components/SearchRecipe";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<IngredientsMixer />} />
            <Route path="/recipe-suggestions" element={<RecipeSuggestions />} />
            <Route path="/search-recipe" element={<SearchRecipe />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
