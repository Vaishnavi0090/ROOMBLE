import React from "react";
import SearchFlatmatesFilter from "./SearchFlatmatesFilter";
import "../../css/FindFlatmate.css";

function FindFlatmate() {
    return (
        <div className="find-flatmate-body">
        <div className="search-flatmate-div">
            <SearchFlatmatesFilter />
        </div>
        <div className="Flatmate-card-div">
            <h1>FlatMate Cards</h1>
        </div>
        </div>
    );
}

export default FindFlatmate;