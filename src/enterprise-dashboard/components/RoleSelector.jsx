import React, { useContext } from "react";
import { RoleContext } from "../context/RoleContext";
import './RoleSelector.css';

export default function RoleSelector() {
    const { role, setRole } = useContext(RoleContext);

    return (
        <div className="role-selector-container">
            <label htmlFor="role-select" className="role-label">View As:</label>
            <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select glass-card"
            >
                <option value="General">General</option>
                <option value="Project Manager">Project Manager</option>
                <option value="VP Engineering">VP Engineering</option>
                <option value="CTO">CTO</option>
                <option value="CFO">CFO</option>
                <option value="CEO">CEO</option>
            </select>
        </div>
    );
}
