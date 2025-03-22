import React,{useState} from 'react';
import DragAndDrop from './AddPropertyComponents/DragAndDrop';
import "../css/AddPropertyStyles/AddProperty.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function AddProperty() {
    const initialFormState = {
        photos: [],
        description: "",
        bhk: "",
        area: "",
        rent: "",
        city: "",
        location: "",
        address: "",
        amenities: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [images,setImages]=useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const notify = (message) => toast(message);

    const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        let newErrors = {};
        
        if (images.length === 0) newErrors.photos = "At least one photo is required.";
        if (!formData.bhk || isNaN(formData.bhk)) newErrors.bhk = "BHK is required and must be a number.";
        if (!formData.area || isNaN(formData.area)) newErrors.area = "Area is required and must be a number.";
        if (!formData.rent || isNaN(formData.rent)) newErrors.rent = "Rent is required and must be a number.";
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.city) newErrors.city = "Please select a city.";
        if (!formData.location) newErrors.location = "Please select a location.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async() => {

        // console.log(images)

        if (!validateForm()) return;
        console.log("Final Form Data:", formData);
        const formDataToSend = new FormData();

        // Append text fields
        formDataToSend.append("description", formData.description);
        formDataToSend.append("bhk", formData.bhk);
        formDataToSend.append("area", formData.area);
        formDataToSend.append("price", formData.rent); // Backend expects "price"
        formDataToSend.append("city", formData.city);
        formDataToSend.append("town", formData.location); // Match backend field names
        formDataToSend.append("address", formData.address);
        formDataToSend.append("amenities", formData.amenities);

        images.forEach((image) => {
            formDataToSend.append("image", image.file); // Ensures backend receives images correctly
        });

        try {
            const token = localStorage.getItem("authtoken");
            if(!token){
                return navigate("/login");
            }
            const response = await fetch("http://127.0.0.1:3000/api/listproperty/listProperty", {
                method: "POST",
                headers: {
                    authtoken: token,
                    accounttype: "landlord", // Include auth token
                },
                body: formDataToSend, // Send FormData directly
            });
    
            const data = await response.json();
    
            if (response.ok) {
                notify("Property added successfully!");
                setImages([]);
                setFormData(initialFormState);
                setErrors({});
            } else {
                notify(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error submitting property:", error);
            notify("An error occurred. Please try again.");
        }
    };

    return (
        <div className="add-prop-container">
            <ToastContainer />
            <div className="add-prop-top">
                <h4 style={{ color: "#7D141D", fontSize: "20px", fontWeight: "bold" }}>Add Property</h4>
                <div className="input-top">
                    <div className={"form-item upload-container"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h4 style={{color:"#7D141D"}}>Upload Photos *</h4>
                            {errors.photos && <p className="addProp-form-error">{errors.photos}</p>}
                        </div>
                        
                        <DragAndDrop images={images} setImages={setImages} updateFormData={updateFormData}/>
                        
                    </div> 
                    <div className={"form-item description-container"}>
                        <h4 style={{color:"#7D141D"}}>Description</h4>
                        <textarea
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            placeholder="Enter Description"
                        /> 
                    </div>
                </div>
            </div>
            <div className="add-prop-middle">
                <div className={"form-item bhk-container"}>
                    <h4 style={{color:"#7D141D"}}>BHK *</h4>
                    <input
                        value={formData.bhk}
                        onChange={(e) => updateFormData("bhk", e.target.value)}
                        placeholder="Enter BHK"
                    />
                    {errors.bhk && <p className="addProp-form-error">{errors.bhk}</p>}
                </div>
                <div className={"form-item Area-container"}>
                    <h4 style={{color:"#7D141D"}}>Area(sqft) *</h4>
                    <input
                        value={formData.area}
                        onChange={(e) => updateFormData("area", e.target.value)}
                        placeholder="Enter Area"
                    />
                    {errors.area && <p className="addProp-form-error">{errors.area}</p>}
                </div>
                <div className={"form-item Rent-container"}>
                    <h4 style={{color:"#7D141D"}}>Rent(Per Month) *</h4>
                    <input
                        value={formData.rent}
                        onChange={(e) => updateFormData("rent", e.target.value)}
                        placeholder="Enter Rent"
                    />
                    {errors.rent && <p className="addProp-form-error">{errors.rent}</p>}
                </div>
                <div className={"form-item City-container"}>
                    <h4 style={{color:"#7D141D"}}>City *</h4>
                    <select
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                    >
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                    </select>
                    {errors.city && <p className="addProp-form-error">{errors.city}</p>}
                </div>
                <div className={"form-item Location-container"}>
                    <h4 style={{color:"#7D141D"}}>Location *</h4>
                    <select
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                    >
                        <option value="">Select Location</option>
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
                    {errors.location && <p className="addProp-form-error">{errors.location}</p>}
                </div>
            </div>
            <div className="add-prop-bottom">
                <div className={"form-item Address-container"}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h4 style={{color:"#7D141D"}}>Address *</h4>
                    {errors.address && <p className="addProp-form-error">{errors.address}</p>}
                    </div>
                    <textarea
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        placeholder="Enter Address"
                    />  
                    
                </div>
                <div className={"form-item Amenities-container"}>
                    <h4 style={{color:"#7D141D"}}>Amenities</h4>
                    <textarea
                        value={formData.amenities}
                        onChange={(e) => updateFormData("amenities", e.target.value)}
                        placeholder="Enter Amenities"
                    />
                </div>
                <button className="Form-Submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default AddProperty