import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header-container">
      <nav className="navbar-container">
        <h2>
          <Link to="/">Food Mixtacular</Link>
        </h2>
        <ul className="navbar-links">
          <li>
            <Link to="/">Ingredients Mixer</Link>
          </li>
          <li>
            <Link to="/recipe-suggestions">Recipe Suggestions</Link>
          </li>
          <li>
            <Link to="/search-recipe">Search Recipe</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
