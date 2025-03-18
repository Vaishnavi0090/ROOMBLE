import React from "react";
import SearchArea from "./FindPropertyComponents/SeachArea";
import "../css/FindPropertyStyles/FindProperty.css";
import PropertyCard from "../components/LandlordDashboard/PropertyCard"

function FindProperty() {
    return (
        <div className="find-property-body">
        <div className="search-area-div">
            <SearchArea />
        </div>
        <div className="Property-card-div">
            <h1>Property Cards</h1>
            <PropertyCard/>
        </div>
        </div>
    );
}

export default FindProperty;