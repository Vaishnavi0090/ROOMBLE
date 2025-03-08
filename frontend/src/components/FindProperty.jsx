import React from "react";
import SearchArea from "./FindPropertyComponents/SeachArea";
import "../css/FindPropertyStyles/FindProperty.css";

function FindProperty() {
    return (
        <div className="find-property-body">
        <div className="search-area-div">
            <SearchArea />
        </div>
        <div className="Property-card-div">
            <h1>Property Cards</h1>
        </div>
        </div>
    );
}

export default FindProperty;