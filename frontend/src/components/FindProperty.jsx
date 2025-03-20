import React from "react";
import SearchArea from "./FindPropertyComponents/SeachArea";
import "../css/FindPropertyStyles/FindProperty.css";
import PropertyCard from "../components/LandlordDashboard/PropertyCard"
import { useState } from "react";

function FindProperty() {
      const [city, setCity] = useState("");
      const [locality, setLocality] = useState("");
      const [BHK, setBHK] = useState([1, 2, 3, 4]);
      const [values, setValues] = useState([1000, 100000]); // Initial values [lower, upper]
      const [area, setArea] = useState([500, 10000]); // Initial values [lower, upper]
    
      const handleSliderChange = (newValues) => {
        setValues(newValues); // `newValues` is an array like [minValue, maxValue]
      };
    
      const handleAreaChange = (newArea) => {
        setArea(newArea); // `newValues` is an array like [minValue, maxValue]
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
        <div className="find-property-body">
        <div className="search-area-div">
        <SearchArea
          city={city}
          setCity={setCity}
          locality={locality}
          setLocality={setLocality}
          BHK={BHK}
          setBHK={setBHK}
          values={values}
          setValues={setValues}
          area={area}
          setArea={setArea}
          handleSliderChange={handleSliderChange}
          handleAreaChange={handleAreaChange}
          handleBHKChange={handleBHKChange}
          handleApplyChanges={handleApplyChanges}
          handleClearChanges={handleClearChanges}
        />
        </div>
        <div className="Property-card-div">
            <h1>Property Cards</h1>
            {/* <PropertyCard/> */}
        </div>
        </div>
    );
}

export default FindProperty;