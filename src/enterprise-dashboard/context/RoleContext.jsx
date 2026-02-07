import { createContext, useState } from "react";
import React from "react";

export const RoleContext = createContext();

export function RoleProvider({ children }) {
    const [role, setRole] = useState("General");

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
}
