import React, { useState } from "react";
import SearchFlatmatesFilter from "./SearchFlatmatesFilter";
import FlatmateCard from "../FlatmateCard";
import "../../css/FindFlatmate.css";

function FindFlatmate() {
    const [flatmates, setFlatmates] = useState([]); // Store fetched data
    
    return (
        <div className="find-flatmate-body">
            <div className="search-flatmate-div">
                {/* Pass setFlatmates to update state */}
                <SearchFlatmatesFilter setFlatmates={setFlatmates} />
            </div>

            <div className="Flatmate-card-div">
               
                
                {/* Display flatmate cards */}
                <div className="flatmate-cards-container">
                {flatmates.length > 0 ? (
                    flatmates.map((flatmate, index) => (
                        
                        <FlatmateCard
                        id={flatmate._id}
                        key={flatmate._id }  // ✅ Ensure unique key
                        
                        name={flatmate.name}
                        locality={flatmate.locality}
                        city={flatmate.city}
                        gender={flatmate.gender}
                        smoke={flatmate.smoke}
                        eatNonVeg={flatmate.veg}
                        pets={flatmate.pets}
                        compatibilityScore={flatmate.recommendationScore}
                        image={flatmate.Images}
                        isBookmarked={flatmate.bookmarked}
                        />
                    ))
                    ) : (
                    <p>No flatmates found.</p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default FindFlatmate;
