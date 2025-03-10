import React, { useState } from "react";
import "../../css/FindPropertyStyles/SearchArea.css";
import SearchIcon from "@mui/icons-material/Search";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function SearchArea() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [BHK, setBHK] = useState([1, 2, 3, 4]);
  const [values, setValues] = useState([1000, 100000]); // Initial values [lower, upper]

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSliderChange = (newValues) => {
    setValues(newValues); // `newValues` is an array like [minValue, maxValue]
  };

  const handleBHKChange = (bhk) => {
    if (BHK.includes(bhk)) {
      setBHK(BHK.filter((b) => b !== bhk));
    } else {
      setBHK([...BHK, bhk]);
    }
  };

  const handleApplyChanges = () => {
    console.log("Search:", search);
    console.log("City:", city);
    console.log("Locality:", locality);
    console.log("BHK:", BHK);
    console.log("Price Range:", values);
  };
  const handleClearChanges = () => {
    setSearch("");
    setCity("");
    setLocality("");
    setBHK([1, 2, 3, 4]);
    setValues([1000, 100000]);
  };
  return (
    <div className="search-prop-container">
      <h1>Filters</h1>
      <div className="search-prop-searchbar">
        <SearchIcon style={{ fontSize: 30 }} />
        <input
          type="text"
          placeholder="Search"
          className="chat-search-input"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="city-search-container">
        <label>City</label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option value="City 1">City 1</option>
          <option value="City 2">City 2</option>
        </select>
      </div>
      <div className="locality-search-container">
        <label>Locality</label>
        <select value={locality} onChange={(e) => setLocality(e.target.value)}>
          <option value="">Select Locality</option>
          <option value="Locality 1">Locality 1</option>
          <option value="Locality 2">Locality 2</option>
        </select>
      </div>
      <div className="price-range-container">
        <label>Price Range</label>
        <div className="price-range-values">
          <p>
            ₹{values[0]}-₹{values[1]}
          </p>
        </div>
        <RangeSlider
          min={1000}
          max={100000}
          step={250}
          value={values}
          onInput={handleSliderChange} // Updates values
        />
      </div>
      <div className="BHK-container">
        <label>Number of BHK</label>
        {[1, 2, 3, 4].map((bhk) => (
          <div key={bhk} className="BHK-checkbox">
            <input
              type="checkbox"
              checked={BHK.includes(bhk)}
              onChange={() => handleBHKChange(bhk)}
            />
            <label>{bhk !== 4 ? bhk + " BHK" : "more"}</label>
          </div>
        ))}
      </div>
      <div className="search-prop-buttons">
        <button onClick={handleApplyChanges}>Apply</button>
        <button onClick={handleClearChanges}>Clear filters</button>
      </div>
    </div>
  );
}

export default SearchArea;
