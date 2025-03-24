import React, { useState } from "react";
import "../../css/FindPropertyStyles/SearchArea.css";
import SearchIcon from "@mui/icons-material/Search";

function SearchFlatmatesFilter({ setFlatmates }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [filters, setFilters] = useState({
    smokeDrink: null,
    pets: null,
    eatNonVeg: null,
    gender: null,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  const handleApplyChanges = async () => {
    const token = localStorage.getItem("authtoken");

    const queryParams = new URLSearchParams();
    if (locality) queryParams.append("locality", locality);

    // Ensure all filters are included explicitly
    if (filters.gender !== null)
      queryParams.append("gender", filters.gender ? "true" : "false");
    if (filters.smokeDrink !== null)
      queryParams.append("smoke", filters.smokeDrink ? "true" : "false");
    if (filters.eatNonVeg !== null)
      queryParams.append("veg", filters.eatNonVeg ? "false" : "true");
    if (filters.pets !== null)
      queryParams.append("pets", filters.pets ? "true" : "false");

    try {
      const response = await fetch(
        `http://localhost:3000/api/Search_Routes/SearchFlatmates?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            authtoken: token,
            accounttype: "tenant",
          },
        }
      );

      const data = await response.json();
            console.log("API Response:", data);
      if (data.success) {
        setFlatmates(data.data);
        console.log("Flatmates Found:", data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleClearChanges = () => {
    setSearch("");
    setCity("");
    setLocality("");
    setFilters({
      smokeDrink: null,
      pets: null,
      eatNonVeg: null,
      gender: null,
    });
    setFlatmates([]);
  };

  return (
    <div className="search-prop-container">
      <h1 style={{ paddingLeft: '20px' ,paddingTop: '20px'}}>  Filters</h1>

      <div className="city-search-container">
        <label>City</label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option value="Mumbai">Mumbai</option>
        </select>
      </div>

      <div className="locality-search-container">
        <label>Locality</label>
        <select value={locality} onChange={(e) => setLocality(e.target.value)}>
          <option value="">Select Locality</option>
          <option value="Andheri">Andheri</option>
          <option value="Bandra">Bandra</option>
          <option value="Juhu">Juhu</option>
          <option value="Malad">Malad</option>
          <option value="Kandivali">Kandivali</option>
          <option value="Borivali">Borivali</option>
          <option value="Dahisar">Dahisar</option>
          <option value="Mira Road">Mira Road</option>
          <option value="Thane">Thane</option>
          <option value="Goregaon">Goregaon</option>
        </select>
      </div>

      {/* Filters */}
      <div className="filter-options">
        {["smokeDrink", "pets", "eatNonVeg"].map((key) => (
          <div key={key} className="filter-row">
            <span className="filter-label">
              {key.replace(/([A-Z])/g, " $1").trim()}?
            </span>
            <div className="filter-choices">
              <label>
                <input
                  type="radio"
                  name={key}
                  value="true"
                  checked={filters[key] === true}
                  onChange={() => handleFilterChange(key, true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={key}
                  value="false"
                  checked={filters[key] === false}
                  onChange={() => handleFilterChange(key, false)}
                />
                No
              </label>
            </div>
          </div>
        ))}

        {/* Gender Filter */}
        <div className="filter-row">
          <span className="filter-label">Gender?</span>
          <div className="filter-choices">
            <label>
              <input
                type="radio"
                name="gender"
                value="true"
                checked={filters.gender === true}
                onChange={() => handleFilterChange("gender", true)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="false"
                checked={filters.gender === false}
                onChange={() => handleFilterChange("gender", false)}
              />
              Female
            </label>
          </div>
        </div>
      </div>

      <div className="search-prop-buttons">
        <button onClick={handleApplyChanges}>Apply</button>
        <button onClick={handleClearChanges}>Clear filters</button>
      </div>
    </div>
  );
}

export default SearchFlatmatesFilter;
