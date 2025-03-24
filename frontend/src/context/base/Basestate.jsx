import React, { useState } from "react";
import { Basecontext } from "./Basecontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import { useNavigate } from "react-router-dom";


const BaseState = (props) => {
    const [user, setUser] = useState({"type":"none"});
    const navigate = useNavigate();
    
    const fetuser = async () => {
        if(localStorage.getItem("authtoken") && user.type === "none"){
            const res = await fetch("http://localhost:3000/api/auth/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": localStorage.getItem("authtoken")
                },
            });
            const data = await res.json();
            // console.log(data.user)
            if(data.success){
                setUser(data.user);
            }
            else{
                toast.error("Please Login again.");
                localStorage.removeItem("authtoken");
                setUser({"type":"none"});
                navigate("/login");
            }
        }
            
    }
    return (
        <Basecontext.Provider value={ {user, setUser, fetuser} }>
            {props.children}
        </Basecontext.Provider>
    );
}

export default BaseState;