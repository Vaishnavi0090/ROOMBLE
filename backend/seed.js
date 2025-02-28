const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Landlord = require("./models/Landlord");
const Tenant = require("./models/Tenant");

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB for seeding"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Sample Landlords
const landlords = [
    {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "hashedpassword123", // Hash passwords in a real app
        propertyList: ["Apartment A", "Apartment B"]
    },
    {
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: "hashedpassword456",
        propertyList: ["Villa X", "Villa Y"]
    }
];

// Sample Tenants
const tenants = [
    {
        name: "Alice Brown",
        email: "alicebrown@example.com",
        password: "hashedpassword789",
        locality: "New York",
        gender: "Female",
        religion: "Christian",
        alcohol: false,
        veg: true,
        pets: true
    },
    {
        name: "Bob White",
        email: "bobwhite@example.com",
        password: "hashedpassword101",
        locality: "Los Angeles",
        gender: "Male",
        religion: "Hindu",
        alcohol: true,
        veg: false,
        pets: false
    }
];

// Insert sample data
const seedDB = async () => {
    try {
        await Landlord.deleteMany(); // Clear existing landlords
        await Tenant.deleteMany(); // Clear existing tenants
        await Landlord.insertMany(landlords);
        await Tenant.insertMany(tenants);
        console.log("✅ Test users added successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Run seeding function
seedDB();
