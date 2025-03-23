import "../App.css";
import { useState } from "react";

export default function NavBar({ handleSubmit, handleYourLocation, searchQuery, setSearchQuery}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  return (
    <nav className="d-flex flex-row navbar justify-content-center w-100">
      <form className="form-inline d-flex" onSubmit={handleSubmit}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            id="search-bar"
            className="form-control w-100"
            type="search"
            placeholder="Search for cities"
            spellCheck="false"
            autoComplete="off"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            // Using onBlur with a short timeout allows the click to register
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          {showSuggestions && (
            <ul
              className="suggestions-list bg-dark text-white bg-opacity-75 rounded-1 shadow-lg border border-white border-opacity-25"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                position: "absolute",
                background: "white",
                width: "100%",
                zIndex: 1000,
              }}
            >
              <li
                style={{ padding: "8px", cursor: "pointer" }}
                onMouseDown={handleYourLocation}
              >
                Use your location
              </li>
            </ul>
          )}
        </div>
        <button className="btn ms-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    </nav>
  );
}
