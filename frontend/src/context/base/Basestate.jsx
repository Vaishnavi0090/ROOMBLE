import React, { useState } from "react";
import { Basecontext } from "./Basecontext";


const BaseState = (props) => {
    const [user, setUser] = useState({"type":"none"});
    
    const fetuser = async () => {
        if(localStorage.getItem("token") && user.type === "none"){
            const res = await fetch("http://localhost:3000/api/auth/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": localStorage.getItem("token")
                },
            });
            const data = await res.json();
            if(data.success){
                console.log(data.user);
                setUser(data.user);
            }
            else{
                setUser({"type":"none1"});
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