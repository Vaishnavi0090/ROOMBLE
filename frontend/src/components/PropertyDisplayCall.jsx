import PropertyDisplay from "../components/PropertyDisplay";
import sampleImage from "../../public/property-img.png"; 

const propertyData = {
  image: sampleImage,
  price: 7000,
  address: "6958 Sanket’s Palace, Kota, Rajasthan",
  description: "This modern and well-lit 2BHK apartment offers a comfortable living...",
  amenities: [
    "24/7 Water & Electricity",
    "High-Speed Internet Available",
    "Balcony With A Scenic View",
    "Gated Community With Security"
  ],
  area: 9000
};

const handleDelist = () => {
  console.log("Property Delisted");
};

const handleDelete = () => {
  console.log("Property Deleted");
};

function App() {
  return (
    <PropertyDisplay 
      {...propertyData} 
      onDelist={handleDelist} 
      onDelete={handleDelete} 
    />
  );
}

export default App;
