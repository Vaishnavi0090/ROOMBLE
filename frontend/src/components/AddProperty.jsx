import React,{useState} from 'react';
import DragAndDrop from './AddPropertyComponents/DragAndDrop';
import "../css/AddPropertyStyles/AddProperty.css";

function AddProperty() {
    const initialFormState = {
        photos: [],
        description: "",
        bhk: "",
        area: "",
        rent: "",
        location: "",
        address: "",
        amenities: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [images,setImages]=useState([]);
    const [errors, setErrors] = useState({});

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
        if (!formData.location) newErrors.location = "Please select a location.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {

        if (!validateForm()) return;
        console.log("Final Form Data:", formData);
        setImages([]);
        setFormData(initialFormState);
        setErrors({});
    };

    return (
        <div className="add-prop-container">
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
                <div className={"form-item Location-container"}>
                    <h4 style={{color:"#7D141D"}}>Location *</h4>
                    <select
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                    >
                        <option value="">Select Location</option>
                        <option value="location1">Location 1</option>
                        <option value="location2">Location 2</option>
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