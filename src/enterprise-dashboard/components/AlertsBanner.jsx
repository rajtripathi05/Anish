import React from 'react';

const AlertsBanner = ({ alerts = [], totalRisk = 0 }) => {
    if (alerts.length === 0 && totalRisk === 0) return null;

    return (
        <div className="alerts-banner glass-card animate-fade-in">
            <div className="alerts-content">
                <div className="alerts-icon-wrapper">
                    <span className="alerts-icon">⚠️</span>
                </div>
                <div className="alerts-text">
                    <h3 className="alerts-title">Critical Attention Needed</h3>
                    <p className="alerts-message">
                        {totalRisk > 0 ? `${totalRisk} teams are currently showing critical delivery risks.` : 'System detected potential bottlenecks.'}
                        {' '}
                        {alerts.length > 0 ? alerts[0].message : 'Investigate portfolio below.'}
                    </p>
                </div>
                <div className="alerts-action">
                    <button className="btn btn-outline-warning btn-sm">View Analysis</button>
                </div>
            </div>
        </div>
    );
};

export default AlertsBanner;
