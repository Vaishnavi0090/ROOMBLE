import React, { useState } from "react";
import "../../css/FindPropertyStyles/SearchArea.css";
import SearchIcon from '@mui/icons-material/Search';

function SearchFlatmatesFilter() {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [locality, setLocality] = useState("");
    const [filters, setFilters] = useState({
        smokeDrink: null,
        pets: null,
        eatNonVeg: null,
        dayWorker: null
    });

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (filter, value) => {
        setFilters({ ...filters, [filter]: value });
    };

    const handleApplyChanges = () => {
        console.log("Search:", search);
        console.log("City:", city);
        console.log("Locality:", locality);
        console.log("Filters:", filters);
    };

    const handleClearChanges = () => {
        setSearch("");
        setCity("");
        setLocality("");
        setFilters({
            smokeDrink: null,
            pets: null,
            eatNonVeg: null,
            dayWorker: null
        });
    };

    return (
        <div className="search-prop-container">
            <h1>Filters</h1>
            <div className="search-prop-searchbar">
                <SearchIcon style={{ fontSize: 30 }} />
                <input type="text" placeholder="Search" className="chat-search-input" value={search} onChange={handleSearchChange} />
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

            {/* Yes/No Checkbox Filters */}
            <div className="filter-options">
                {[
                    { label: "Smoke/drink?", key: "smokeDrink" },
                    { label: "Pets?", key: "pets" },
                    { label: "Eat non-veg?", key: "eatNonVeg" },
                    { label: "Day time worker?", key: "dayWorker" }
                ].map((filter) => (
                    <div key={filter.key} className="filter-row">
                        <label>{filter.label}</label>
                        <input 
                            type="checkbox" 
                            checked={filters[filter.key] === true} 
                            onChange={() => handleFilterChange(filter.key, true)} 
                        />
                        <label>Yes</label>
                        <input 
                            type="checkbox" 
                            checked={filters[filter.key] === false} 
                            onChange={() => handleFilterChange(filter.key, false)} 
                        />
                        <label>No</label>
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

export default SearchFlatmatesFilter;
