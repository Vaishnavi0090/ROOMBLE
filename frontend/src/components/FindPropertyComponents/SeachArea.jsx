import React from "react";
import "../../css/FindPropertyStyles/SearchArea.css";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function SearchArea({
  city,
  setCity,
  locality,
  setLocality,
  BHK,
  setBHK,
  values,
  setValues,
  area,
  setArea,
  handleSliderChange,
  handleAreaChange,
  handleBHKChange,
  handleApplyChanges,
  handleClearChanges,
}) {
  
  return (
    <div className="search-prop-container">
      <h1>Filters</h1>
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
      <div className="area-range-container">
        <label>Area Range</label>
        <div className="area-range-values">
          <p>
            {area[0]}sqft-{area[1]}sqft
          </p>
        </div>
        <RangeSlider
          min={500}
          max={10000}
          step={50}
          value={area}
          onInput={handleAreaChange} // Updates values
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
