import React, { useState } from "react";
import { Basecontext } from "./Basecontext";

const BaseState = (props) => {
    const [user, setUser] = useState({"type":"none"});
    return (
        <Basecontext.Provider value={ {user, setUser} }>
            {props.children}
        </Basecontext.Provider>
    );
}

export default BaseState;