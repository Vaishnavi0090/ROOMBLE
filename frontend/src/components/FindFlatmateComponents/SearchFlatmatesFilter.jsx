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
        gender: null
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
            gender: null
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

            {/* Yes/No Checkbox Filters */}
            <div className="filter-options">
                {[
                    { label: "Smoke/drink?", key: "smokeDrink" },
                    { label: "Pets?", key: "pets" },
                    { label: "Eat non-veg?", key: "eatNonVeg" }
                ].map((filter) => (
                    <div key={filter.key} className="filter-row">
                        <span className="filter-label">{filter.label}</span>
                        <div className="filter-choices">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={filters[filter.key] === true} 
                                    onChange={() => handleFilterChange(filter.key, true)} 
                                />
                                Yes
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={filters[filter.key] === false} 
                                    onChange={() => handleFilterChange(filter.key, false)} 
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
                                type="checkbox" 
                                checked={filters.gender === true} 
                                onChange={() => handleFilterChange("gender", true)} 
                            />
                            Male
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
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
