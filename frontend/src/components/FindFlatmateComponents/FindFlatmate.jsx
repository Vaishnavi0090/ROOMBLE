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
                <h1>FlatMate Cards</h1>
                
                {/* Display flatmate cards */}
                <div className="flatmate-cards-container">
                    {flatmates.length > 0 ? (
                        flatmates.map((flatmate) => (
                            <FlatmateCard
                                key={flatmate._id}
                                name={flatmate.name}
                                locality={flatmate.locality}
                                city={flatmate.city}
                                gender={flatmate.gender}
                                smoke={flatmate.smoke}
                                eatNonVeg={flatmate.veg}
                                pets={flatmate.pets}
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
