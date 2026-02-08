import React from 'react';
import { RoleContext } from '../context/RoleContext';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { role, setRole } = React.useContext(RoleContext);

    const menuItems = [
        { id: 'analytics', label: 'Overview', icon: '📊' },
        { id: 'teams', label: 'Teams Portfolio', icon: '🏢' },
        { id: 'reports', label: 'Reports', icon: '📋' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="app-sidebar glass-card">
            <div className="sidebar-logo">
                <div className="logo-icon">💠</div>
                <span className="logo-text">Enterprise.AI</span>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">
                    {role.charAt(0)}
                </div>
                <div className="user-info">
                    <span className="user-role">{role}</span>
                    <span className="user-status">Online</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-filter-section">
                    <h4 className="filter-title">Quick Filters</h4>
                    <div className="filter-options">
                        <label className="filter-label">
                            <input type="checkbox" defaultChecked /> Active Teams
                        </label>
                        <label className="filter-label">
                            <input type="checkbox" /> Critical Risks
                        </label>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
