import React from "react";
import SearchArea from "./FindPropertyComponents/SeachArea";
import "../css/FindPropertyStyles/FindProperty.css";
import PropertyCardTenant from "../components/FindPropertyComponents/PropertyCardTenant";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function FindProperty() {
      const [city, setCity] = useState("");
      const [locality, setLocality] = useState("");
      const [BHK, setBHK] = useState([4]);
      const [values, setValues] = useState([1000, 100000]); // Initial values [lower, upper]
      const [area, setArea] = useState([500, 10000]); // Initial values [lower, upper]
      const [properties, setProperties] = useState([]);
      const [error, setError] = useState("");
      const [lastSearchLocality, setLastSearchLocality] = useState("");
      const [filtersApllied, setFiltersApplied] = useState(false);
      const navigate = useNavigate();
      const matchingProperties = properties.filter((property) => property.town === lastSearchLocality);
      const otherProperties = properties.filter((property) => property.town !== lastSearchLocality);
      const notify = (message) => toast(message);
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
          setBHK([bhk]);
        }
      };
    
      const handleApplyChanges = async () => {
        
        try {
            const token = localStorage.getItem("authtoken");
            if (!token) {
                return navigate("/login");
            }
            if(!locality){
                notify("Please select a locality!");
                return;
            }
            const response = await axios.get("http://localhost:3000/api/Search_Routes/SearchProperties", {
                headers: {
                    authtoken: token,
                    accounttype: "tenant",  
                },
                params: {  
                    town: locality,
                    min_price: values[0],
                    max_price: values[1],
                    min_area: area[0],
                    max_area: area[1],
                    bhk: BHK[0] === 4 ? "more" : BHK, //
                },
            });
            setLastSearchLocality(locality);
            setProperties(response.data);
            console.log("Properties fetched:", response.data);
            setError("");
            setFiltersApplied(true);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError(err.response?.data?.error || "Something went wrong");
            setFiltersApplied(false);
        }
    };
    
      const handleClearChanges = () => {
        setCity("");
        setLocality("");
        setBHK([4]);
        setValues([1000, 100000]);
        setArea([500, 10000]);
        setProperties([]);
        setError("");
        setLastSearchLocality("");
        setFiltersApplied(false);
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
            <ToastContainer />
                {/* Display Matching Properties First */}
                {!filtersApllied  && <h2>Please select a locality in filters and click apply</h2>}
                {(filtersApllied && matchingProperties.length === 0) && <h2>Sorry! No propertiey matched with your filters</h2>}
                {matchingProperties.length > 0 && (
                    <>

                        <h2>Properties in {lastSearchLocality}</h2>
  
                        {matchingProperties.map((property) => (
                            <PropertyCardTenant
                                key={property._id}
                                image={property.Images[0]}
                                price={property.price}
                                title={property.name}
                                location={`${property.address}, ${property.town}, ${property.city}`}
                                bhk={property.bhk}
                                onView={() => console.log("Viewing:", property.name)}
                                onDelete={() => console.log("Deleting:", property._id)}
                            />
                        ))}
                    </>
                )}

                {/* Display Other Properties */}
                {(otherProperties.length > 0) && (
                    <>
                        <h2>Other Properties You May Be Interested In</h2>
                        {otherProperties.map((property) => (
                            <PropertyCardTenant
                                key={property._id}
                                image={property.Images[0]}
                                price={property.price}
                                title={property.name}
                                location={`${property.address}, ${property.town}, ${property.city}`}
                                bhk={property.bhk}
                                onView={() => console.log("Viewing:", property.name)}
                                onDelete={() => console.log("Deleting:", property._id)}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default FindProperty;